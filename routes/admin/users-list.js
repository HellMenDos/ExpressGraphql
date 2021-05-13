const {Router} = require('express')
const router = Router()
const {isAdmin} = require('../../utils/helpers')
const DB = require('../../utils/db')
const Users = require('../../models/user');
const config = require('../../config')
const {pagination} = require('../../utils/pagination')
const validator = require('validator')
const genPass = require('generate-password')
const bcrypt = require('bcryptjs')
const mailer = require('../../utils/mailer')


router.get('/trash/:id',async (req, res) => {
  Users.destroy({where: {id: req.params.id} }).then(() => {
    res.redirect("/admin/users-list/");
  })
})

router.get('/:page?/:er?', async (req, res) => {
    if (typeof req.params.page == 'undefined') {
        req.params.page = 1;
    }
    if (typeof req.params.er == 'undefined') {
        req.params.er = false;
    }
    
    
    const offset = (req.params.page - 1) * config.ON_PAGE;
    const q = await Users.findAndCountAll({
        //  where: {...},
        order: [['id', 'DESC']],
        limit: config.ON_PAGE,
        offset,
        raw: true
    });

    res.render('users-list', {
        title: 'Список пользователей',
        data: q.rows,
        er:req.params.er,
        pagination: pagination('/admin/users-list/', req.params.page, q.count)
    })
})
router.post('/change',async (req, res) => {
  Users.update({name: req.body.name, email: req.body.email,rating: req.body.rating ,descr: req.body.descr}, {where: {id: req.body.iduser} }).then(() => {
    res.redirect("/admin/users-list/");
  })
})

router.post('/',async (req, res) => {
        let email = req.body.email;
        console.log(email)
        let id = req.body.idform;
        let password = req.body.password;
        let name = req.body.name;
        let uuid = 0;
        let descr = req.body.descr;

        const candidate = await Users.findOne({where: {id}})
        const candidateemail = await Users.findOne({where: {email}})
        console.log(candidate)
        if (candidate) {           
            res.redirect('/admin/users-list/1/Id_already_exists')
        }
        if (candidateemail) {           
            res.redirect('/admin/users-list/1/Email_already_exists')
        }
        if (!validator.isEmail(email)) {
             res.redirect('/admin/users-list/1/Email_not_valid')
        }
        if (!validator.isLength(password, {min: 3})) {
            res.redirect('/admin/users-list/1/Password_min_length')
        }

        const checkUUID = await Users.findOne({where: {uuid}})
        if (checkUUID) {
            uuid = genPass.generate({length: 36, numbers: true})
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const token = genPass.generate({length: 32, numbers: true})

        // const rid = global.cookies.rid || 0
        // const pid = global.cookies.pid || 0


        const user = new Users({
            id, email, token, password: hashPassword, name,descr, uuid, regDate: Date.now()//, rid, pid
        })

        await user.save()

        mailer(email, 'Successful registration', `Your email: ${email}\nYour password: ${password}`)

       res.redirect('/admin/users-list/')
})



module.exports = router
