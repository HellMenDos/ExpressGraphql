
const cron = require('node-cron');
const {Router} = require('express');
const router = Router()
const Images = require('./models/images');
const sequelize = require('./utils/db-connect')
const axios = require('axios')
const DB = require('./utils/db')
const ImagesResolve = require('./resolvers/images');
const request = require('request')
const fs = require('fs')
const sizeOf = require('image-size');
const Jimp = require('jimp');
const cheerio = require('cheerio')
const { exec } = require("child_process");
const ig = require('instagram-scraping');


var cr = async function() {

function countTime(time) {
    let str = '';
    for (var i = 1; i < 24; i=i+parseInt(time)) {
        if ((i + parseInt(time)) >= 24) {
            str += i.toString()
            console.log(str)
            return str
        }else {
            str += `${i.toString()},`
        }
    }
}

let download = function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log('content-type:', res);
    console.log('content-length:', res);

    await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


let data = await DB.q("SELECT * FROM `conf`")

/*
cron.schedule(`* * * * *`, function() {


function kekparser(id,download) {
var header = {
    "Authorization": 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkSFZ0NjdiLVNKU3poaDJ5dDZneGpDOkFQQTkxYkZrYW81aGlxQzlNMGxpYmNNcXZJajdJSHBVWTNQOFRGcFNVaXNWYS02bmd2Wld2Ny1uLVpqb20yX1ZkSVNVQkF2dTZJOGYtU2h2Vmt6S1ZHeldULW1sQUNhY29OanJDTGFQQzc2aWs1SXA1RVBnTWIzWFJYRzZIaXJNckhaWnk3Z25kcjlrIiwiZXhwIjoxNjA1ODQ0NDY1fQ.N19uoJHp0uYq6wSKi5qN3tL707JxRmcfJywTsUCZHfEXDhk17ke5-cCD_K7PLujR41vHScPC8YbuBvWmBrEj4Q',
    "Accept-Language": 'en-US,ru-RU',
    "ApiVersion": 3,
    "ab-test-seed":86012943,
    "content-ranking-group": id,
    "Content-Length":0
}

axios({
    method: 'post',
    url: 'https://lol.kekfeed.com/dose',
    headers: header
})
.then(function (response) {
    for (var i = 0; i < response.data.memes.length; i++) {
       let url = 'https://'+response.data.memes[i].content.picture
       let title = 'Картинка'
       let fileName = url.split('/').pop() + '.png' 

       ImagesResolve.findImageByPath(fileName).then((value) => { 
                        console.log(fileName + ' ===== ' + value)
                        if (value == 0) {

                            // Saving image to DataBase
                            ImagesResolve.SaveImage(fileName,title,102,0).catch(error => {
                            console.error(error)
                            })
                            // Saving image to a folder in public/files/images/${ FOLDER }
                            download(url, './public/files/images/'+fileName, function(){
                               console.log('done')
                            }).catch(error => {
                            console.error(error)
                            });
                        
                        }
                    }).catch(error => {
                        console.error(error)
                    })


    }
}).catch(function (error) {
    console.log(error);
});
}

page = 0
var inerval = setInterval(()=> {
    if (page == parseInt(data[4].content)) {
        clearInterval(inerval)
    }else {
    kekparser(page,download)
    page++  
    }
},3000)





});
*/

cron.schedule(`5 ${countTime(parseInt(data[2].content))} * * *`, function() {
  

function parse(page) {
    for (let i = page; i <= page; i++) {
        axios.get('https://idaprikol.ru/page' + i, {
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'}
        }).then(response => {
                data = response.data
                const $ = cheerio.load(data)
                $('.media__image').each((i, elem) => {
                    // Getting data variable
                    let title = elem.attribs.alt.toString().replace(/\n+/g, ' ')
                    let url = elem.attribs["data-src"]
                    let isvideo = elem.parent.attribs.href.toString()
                    let fileName = url.split('/').pop() + '.png'                    
                    if (elem.parent.parent.parent.attribs['data-type'] == undefined) {
                   
                    ImagesResolve.findImageByPath(fileName)
                    .then((value) => { 
                        console.log(fileName + ' ===== ' + value)
                        if (value == 0) {

                            // Saving image to DataBase
                            ImagesResolve.SaveImage(fileName,title,101,0).catch(error => {
                            console.error(error)
                            })
                            // Saving image to a folder in public/files/images/${ FOLDER }
                            download(url, './public/files/images/'+fileName, function(){
                            
                            let sizeImgd = sizeOf('./public/files/images/'+fileName)
                            let height = sizeImgd.height - 30
                            let width = sizeImgd.width
                            console.log(height)                   // main resize function
                            Jimp.read('./public/files/images/'+fileName, (err, lenna) => {
                            
                            if (err) throw err;
                            lenna
                            .crop(0, 0,width,height) // resize
                            .quality(100) // set JPEG quality
                            .write('./public/files/images/'+fileName); // save
                            })
                            });
                        
                        }
                    }).catch(error => {
                        console.error(error)
                    })
                    }else {
                    let videoName = elem.parent.parent.parent.attribs['data-source'].toString().split('/').pop();
                    ImagesResolve.findImageByPath(videoName)
                    .then((value) => { 
                        if (value == 0) {
                        let videoName = elem.parent.parent.parent.attribs['data-source'].toString().split('/').pop();
                        let videoURL = elem.parent.parent.parent.attribs['data-source'].toString()
                        ImagesResolve.SaveImage(videoName,title,101,1).catch(error => {
                            console.error(error)
                            })
                        
                        download(videoURL, './public/files/videos/'+videoName, function(){
                            console.log('done');
                        });
                    }
                }).catch(error => {
                    console.error(error)
                })

                    }
                })           
            })
            .catch(error => {
                console.error(error)
            })
    }
}

// 500 posts
page = 1
var inerval = setInterval(()=> {
    if (page == parseInt(data[5].content)) {
        clearInterval(inerval)

    }else {
    parse(page)
    page++  
    }
},3000)





});


cron.schedule(`0 ${data[3].content} * * *`, async  function() {

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


});

let dataTikTok = await DB.q("SELECT * FROM `tiktok`")
for (var i = 0; i < dataTikTok.length; i++) {
cron.schedule(`5 ${countTime(parseInt(dataTikTok[i].time))} * * *`, async function() {
console.log(4);
let tag = dataTikTok[i].tag;
let am = dataTikTok[i].am;
let title = 'TikTok video'
exec(`tiktok-scraper hashtag --filepath "./public/files/videos" ${tag} -d -n  ${am}`, (error, stdout, stderr) => {
exec(`rm -rf ./public/files/videos/${tag}`, (error, stdout, stderr) => {
exec(`mv './public/files/videos/#'${tag}   ./public/files/videos/${tag}`, (error, stdout, stderr) => {
console.log(error)
console.log(stdout)
console.log(stderr)
let fileName = ''
let arr = []
fs.readdir(`./public/files/videos/${tag}`, (err, files) => {
arr = files;
console.log(arr)


console.log(tag)
for (var i = 0; i < arr.length; i++) {
    fileName = `${tag}/${arr[i]}`
console.log(fileName)
console.log(title)   
 ImagesResolve.SaveImage(fileName,title,parseInt(dataTikTok[i].personid),1).catch(error => {
    console.error(error)
    })
}
})
})
})
});


    })
}


let inst = await DB.q("SELECT * FROM `instagram`")
for (let h = 0; h < inst.length; h++) {
    cron.schedule(`5 ${countTime(parseInt(inst[h].TIME))} * * *`, async function() {
        
        ig.scrapeTag(inst[h].TAG).then(result => {
        for (var i = 0; i < result.medias.length; i++) {
        if (result.medias[i].is_video) {
        var URL = 'https://www.instagram.com/p/'+result.medias[i].shortcode; // Video URL
        
        request(URL,async function (error, response, body) {

          const $ = await cheerio.load(body);
          const videoTag = $('meta[property="og:video"]').attr('content'); // through meta tag
          let fileName = videoTag.substr(-10) + '.mp4'

          let title = 'instagram videos'

          ImagesResolve.SaveImage(fileName,title,parseInt(inst[h].PERSONID),1).catch(error => {
                            console.error(error)
           })
          download(videoTag, './public/files/videos/'+fileName, function(){
            console.log('done')
          })
        });


        }else {

          let fileName = result.medias[i].display_url.substr(-10) + '.png'
          let title = 'instagram video'

          ImagesResolve.SaveImage(fileName,title,parseInt(inst[h].PERSONID),0).catch(error => {
                            console.error(error)
           })
          download(result.medias[i].display_url, './public/files/images/'+fileName, function(){
            console.log('done')
          })            

        }
  }
});
    })
}





let vk = await DB.q("SELECT * FROM `vktable`")
for (let p = 0; p < vk.length; p++) {
    cron.schedule(`* * * * *`, async function() {
    console.log(4)

        request(`https://api.vk.com/method/groups.getById?&access_token=9aaf20809aaf20809aaf2080e79adafa3e99aaf9aaf2080c5556ef45ffe378c6ddaba00&v=5.126&group_ids=${vk[p].publictag}`, function (error, response, body) {
            request(`https://api.vk.com/method/wall.get?&access_token=9aaf20809aaf20809aaf2080e79adafa3e99aaf9aaf2080c5556ef45ffe378c6ddaba00&v=5.126&owner_id=-${JSON.parse(body).response[0].id}&count=${vk[p].amount}`, function (error, response, body) {
                  for (let y=0; y < JSON.parse(body).response.items.length; y++) {
                      //JSON.parse(body).response.items[0].copy_history[0].attachments
                      if (JSON.parse(body).response.items[y].attachments) {
                        var fileName = JSON.parse(body).response.items[y].attachments[0].photo.sizes.pop().url.substr(-20) + '.png'
                        var title = 'Vk photo'

                        ImagesResolve.SaveImage(fileName,title,parseInt(vk[p].id_user),0).catch(error => {
                            console.error(error)
                        })

                        download(JSON.parse(body).response.items[y].attachments[0].photo.sizes.pop().url, './public/files/images/'+fileName, function(){
                           console.log('done')
                        }) 
                      }
                  }
            });
        });        

    })
}






}




module.exports = cr