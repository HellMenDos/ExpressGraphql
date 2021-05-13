const express = require('express')
const app = express()
const path = require('path')
const graphqlHTTP = require('express-graphql')
const sequelize = require('./utils/db-connect')
const multer  = require("multer");

const auth = require('./middleware/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')

const cors = require('cors')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// routes require section
const cronRoutes = require('./routes/cron')

const uploadRoutes = require('./routes/upload')
const adminAuth = require('./routes/admin/auth')
const adminHome = require('./routes/admin/home')
const adminImages = require('./routes/admin/images')
const adminUsersList = require('./routes/admin/users-list')
const adminUser = require('./routes/admin/user')
const cr = require('./cron-main')

const exphbs = require('express-handlebars')
const config = require('./config')
const giql = process.env.NODE_ENV !== 'production'
const view = require('./View-config')
const redfile = require('./Redis-config')
const graph = require('./graphql-api')


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        
        if (file.mimetype.indexOf('video') != 0 && req.url != '/upload/avatar') {
        cb(null, "public/files/images");
    }else if(req.url == '/upload/avatar') {
        cb(null, "public/files/avatar");
    }else {
        cb(null, "public/files/videos");
    }
    },
    filename: (req, file, cb) =>{
        if (file.mimetype.indexOf('video') != 0) {
        cb(null, file.originalname+ "-" + Date.now() + '.png');
    }else {
        cb(null, file.originalname.split('.')[0] +'-'+ Date.now() +'.'+file.originalname.split('.').pop());
    }
    }
});

const fileFilter = (req, file, cb) => {
    console.log(file)
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"|| 
    file.mimetype.indexOf('video') == 0){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }



// view handler
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')))
app.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("filedata"));
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 },}));
app.use(express.json())
app.use(cookieParser())

view(app,exphbs)
// redis conf and connection
redfile(app,config)


// all middalwares
app.use(flash())
app.use(auth)
app.use(varMiddleware)
app.use(userMiddleware)




// admin section 
app.use('/upload', uploadRoutes)
app.use('/cron', cronRoutes)
app.use('/admin', adminHome)
app.use('/admin', adminAuth)
app.use('/admin/images', adminImages)
app.use('/admin/users-list', adminUsersList)
app.use('/admin/user', adminUser)


graph(app,graphqlHTTP,giql)
// parser
// node cron file 
cr()
// server hendler

app.use(errorHandler)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
