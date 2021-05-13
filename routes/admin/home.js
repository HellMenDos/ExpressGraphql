const express = require("express");
const router = express();
const {isAdmin} = require('../../utils/helpers')
const DB = require('../../utils/db')
const { exec } = require("child_process");
const axios = require('axios')



router.get('/', async (req, res) => {
    if (typeof req.user == 'undefined' || !req.user.id || !isAdmin(req.user.id)) {
        res.redirect('/admin/login#login')
    }
  
    const contentReq = await DB.q("SELECT * FROM `conf`");


    const tl = await DB.q("SELECT * FROM `tiktok` ");
    const il = await DB.q("SELECT * FROM `instagram` ");
    const vk = await DB.q("SELECT * FROM `vktable` ");


    const users = await DB.count('users');
    const images = await DB.count('images');
    const moderContent = await DB.count('contentModeration');
    const saved = await DB.count('saved');
    const subscribes = await DB.count('subscribes');


    res.render('index', {
        title: 'Главная страница',
        isHome: true,
        count: {users, images, moderContent, saved, subscribes},
        titleForm: contentReq[0].title,
        contentForm: contentReq[0].content,
        KekfeedАm: contentReq[4].content*10,
        Kekfeed: contentReq[1].content,
        idpАm: contentReq[5].content*50,
        idp: contentReq[2].content,
        push: contentReq[3].content,
        icon:contentReq[6].content,
        iconSecond:contentReq[9].content,
        TikToklist: tl,
        Instalist: il,
        Vklist:vk

    })
})

router.get('/delinst/:id', (req, res) => {
DB.delete('instagram',{ID:req.params.id})
res.redirect('/admin')
})
router.get('/del/:id', (req, res) => {
DB.delete('tiktok',{id:req.params.id})
res.redirect('/admin')
})
router.get('/delvk/:id', (req, res) => {
DB.delete('vktable',{id:req.params.id})
res.redirect('/admin')
})

router.post('/', async(req, res) => {


  if (req.body.titleNotify != undefined) {
await DB.update('conf',{title: req.body.titleNotify ,content: req.body.contentNotify },{id:1});
await DB.update('conf',{content: req.body.push },{id:4});

exec("pm2 restart Memogram", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

res.redirect('/admin')
}

if (req.body.TikTokTag != undefined) {
await DB.insert('tiktok',{tag: req.body.TikTokTag.toString(),time:req.body.TikTokTime.toString(),personid:req.body.TikTokID.toString(),am:req.body.TikTokAm.toString()  });

exec("pm2 restart Memogram", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

res.redirect('/admin')
}

if (req.body.VkTag != undefined) {
await DB.insert('vktable',{publictag: req.body.VkTag.toString(),time:req.body.VkTime.toString(),amount:req.body.VkAmount.toString(),id_user:req.body.VkID.toString()  });

exec("pm2 restart Memogram", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

res.redirect('/admin')
}

if (req.body.InstaTag != undefined) {
await DB.insert('instagram',{tag: req.body.InstaTag.toString(),time:req.body.InstaTime.toString(),personid:req.body.InstaID.toString() });

exec("pm2 restart Memogram", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

res.redirect('/admin')
}

if (req.body.KekfeedАm != undefined) {
await DB.update('conf',{content: req.body.KekfeedАm/10 },{id:5});  
await DB.update('conf',{content: req.body.Kekfeed },{id:2});

exec("pm2 restart Memogram", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

res.redirect('/admin')

}

if (req.body.idpАm != undefined) {
await DB.update('conf',{content: req.body.idpАm/50 },{id:6});  
await DB.update('conf',{content: req.body.idp },{id:3});

exec("pm2 restart Memogram", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

res.redirect('/admin')

}

})

router.get('/sendnotification', async (req, res) => {

    let data = await DB.q("SELECT * FROM `conf`")

    var body = {
        "app_id": "0b28bbfc-9d29-4fb7-9e94-7fc133dd8913",
        "included_segments": ["Active Users"],
        "headings":{"en":data[0].title },
        "contents":{"en":data[0].content},
        "small_icon":"ic_stat_onesignal_default",
        "android_led_color":"FF0000FF"
    }

    if (data[6].content) {
    body.large_icon = 'https://back.memogram.app/files/images/'+data[6].content
    }

    if (data[9].content) {
    body.big_picture = 'https://back.memogram.app/files/images/'+data[9].content
    }


    console.log(body)
    var header = {
        "Content-Type": 'application/json',
        "Authorization": 'Basic NTYxMWQ3ZjItNjYxMS00MTQxLWI0MDYtZGM1NTdjMmNmODBk'
    }

    axios({
        method: 'post',
        url: 'https://onesignal.com/api/v1/notifications',
        data: body,
        headers: header
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    res.redirect('/admin')
})

router.post('/file', async(req, res) => {
let filedata = req.file;
    if(filedata){
        await DB.update('conf',{content: filedata.filename },{id:7});
        res.redirect('/admin')
    }
})

router.post('/fileSecond', async(req, res) => {
let filedata = req.file;
    if(filedata){
        await DB.update('conf',{content: filedata.filename },{id:10});
        res.redirect('/admin')
    }
})


module.exports = router
