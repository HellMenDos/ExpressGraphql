const ImagesResolve = require('../resolvers/images');
const sequelize = require('../utils/db-connect')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')
const sizeOf = require('image-size');
const Jimp = require('jimp');


var parser = function(app) {
app.use(function (req, res, next) {

// download function
var download = function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

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
    if (page == 5) {
        clearInterval(inerval)

    }else {
    parse(page)
    page++  
    }
},3000)

  next();
});

}


module.exports = parser
