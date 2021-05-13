const {Router} = require('express')
const router = Router()
const Images = require('../../models/images');
const contentModeration = require('../../models/content-moderation');
const fs = require('fs')
const path = require('path')
const jimp = require('jimp')
const config = require('../../config')
const DB = require('../../utils/db')

const {pagination} = require('../../utils/pagination')



router.get('/moderation', async (req, res) => {
    if (typeof req.params.page == 'undefined') {
        req.params.page = 1;
    }
    const offset = (req.params.page - 1) * config.ON_PAGE;
    const q = await contentModeration.findAndCountAll({
        //  where: {...},
        order: [['id', 'DESC']],
        limit: config.ON_PAGE,
        offset,
        raw: true
    });
    
    for (var i = 0; i < q.rows.length; i++) {
       if (q.rows[i].path.split('.').pop() != 'jpg' && q.rows[i].path.split('.').pop() != 'jpeg' && q.rows[i].path.split('.').pop() != 'png') {
          q.rows[i].video = 1 
       }else {
          q.rows[i].video = 0
       }
    }
    res.render('moderation', {
        title: 'Модерация',
        data: q.rows,
        pagination: pagination('/images/moderation/', req.params.page, q.count)
    })
})


router.get('/list/:page?', async (req, res) => {
    if (typeof req.params.page == 'undefined') {
        req.params.page = 1;
    }
    const offset = (req.params.page - 1) * config.ON_PAGE;
    const q = await Images.findAndCountAll({
        //  where: {...},
        order: [['id', 'DESC']],
        limit: config.ON_PAGE,
        offset,
        raw: true
    });

    res.render('images-list', {
        title: 'Картинки',
        data: q.rows,
        pagination: pagination('/admin/images/list/', req.params.page, q.count)
    })
})

//
// router.get('/list', async (req, res) => {
//     let html = '';
//     const candidates = await Images.findAll({order: [['id', 'DESC']]});
//     candidates.map(async row => {
//         html = html + '<div style="display: inline-block"><a href="/files/images/' + row.path + '" target="_blank">' +
//             '<img src="/files/images/' + row.path + '" style="width:200px;padding-right: 10px">' +
//             '</a><br/><a href="/admin/images/delete/' + row.id + '">DELETE</a>' +
//             '<br/><a href="/admin/images/crop/' + row.id + '">CROP</a></div>';
//     })
// })


router.get('/stat', async (req, res) => {
    
    const date = new Date().toISOString().split('T')[0];
    const now = await DB.q('SELECT *,(SELECT count(*) FROM images WHERE `images`.`uid`=`users`.`id` AND images.date LIKE "%'+date+'%") AS count  FROM users WHERE id < 1000 AND id > 99')
    const dateyestarday = new Date();
    const yestarday = await DB.q('SELECT *,(SELECT count(*) FROM images WHERE `images`.`uid`=`users`.`id` AND images.date LIKE "%'+dateyestarday.setDate(dateyestarday.getDate() - 1)+'%") AS count  FROM users WHERE id < 1000 AND id > 99')
    const datemounth = new Date();
    const mounth = await DB.q('SELECT *,(SELECT count(*) FROM images WHERE `images`.`uid`=`users`.`id` AND images.date LIKE "%2020-'+(datemounth.getMonth())+'%") AS count  FROM users WHERE id < 1000 AND id > 99')
    const week = await DB.q('SELECT *,(SELECT count(*) FROM images WHERE `images`.`uid`=`users`.`id` AND images.date > NOW() - INTERVAL 7 DAY) AS count  FROM users WHERE id < 1000 AND id > 99')

    res.render('stat', {
        title: 'Модерация',
        now,
        yestarday,
        mounth,
        week            
    })
})

router.get('/moderation-delete/:id', async (req, res) => {
    const candidate = await contentModeration.findOne({where:{id: req.params.id}});
    if(!candidate){
        res.status(200).json({Status: 'Not found'});
    }else {
        if(fs.existsSync('public/files/images/'+candidate.path)) {
            await fs.unlinkSync('public/files/images/' + candidate.path);
        }
        await candidate.destroy();
        res.redirect('/admin/images/moderation');
    }
})


router.get('/moderation-confirm/:id', async (req, res) => {
    const candidate = await contentModeration.findOne({where:{id: req.params.id}});
    if(!candidate){
        res.status(200).json({Status: 'Not found'});
    }else {
        if (candidate.path.split('.').pop() != 'jpg' && candidate.path.split('.').pop() != 'jpeg' && candidate.path.split('.').pop() != 'png') {
        const img = await Images.create({path: candidate.path, title: candidate.title, uid:candidate.uid,date: Date.now(), contentType: 1});
        await img.save();
        await candidate.destroy();
        res.redirect('/admin/images/moderation');
    }else {
       const img = await Images.create({path: candidate.path, title: candidate.title, uid:candidate.uid,date: Date.now(), contentType: 0});
        await img.save();
        await candidate.destroy();
        res.redirect('/admin/images/moderation'); 
    }
    }
})


router.get('/delete/:id', async (req, res) => {
    const candidate = await Images.findOne({where:{id: req.params.id}});
    if(!candidate){
        res.status(200).json({Status: 'Not found'});
    }else {
        if(fs.existsSync('public/files/images/'+candidate.path)) {
            await fs.unlinkSync('public/files/images/' + candidate.path);
        }
        await candidate.destroy();
        res.redirect('/admin/images/list');
    }
})


router.get('/crop/:id', async (req, res) => {
    const candidate = await Images.findOne({where: {id: req.params.id}});
    if (!candidate) {
        res.status(200).json({Status: 'Not found'});
    } else {
        const imagePath = path.join(__dirname, '../', 'public', 'files', 'images', candidate.path);

        console.log(imagePath);

        jimp.read(imagePath, (err, img) => {
            if (err) throw err;
            let newHeight = img.bitmap.height - 20;
            img.crop(0, 0, img.bitmap.width, newHeight).write(imagePath);
        });

        res.redirect('/admin/images/list');
    }
})


router.get('/clean-orphans', async (req, res) => {
    let bad=0;
    let good=0;
    const inBase=[];
    const candidates = await Images.findAll({order: [['id', 'DESC']]});
    candidates.map(async row => {
        inBase.push(row.path);
    })
    const dir = await fs.readdirSync(path.join(__dirname,'../','public','files','images'));
    dir.forEach((file, indx)=>{
        if(inBase.includes(file)){
            good++;
        }else{
            fs.unlinkSync(path.join(__dirname,'../','public','files','images',file));
            bad++;
        }
    })
    console.log('Good: ', good);
    console.log('Bad: ', bad);
    res.redirect('/admin/images/list');
})

module.exports = router
