const {Router} = require('express');
const router = Router()
const Images = require('../models/images');
const sequelize = require('../utils/db-connect')
const axios = require('axios')
const DB = require('../utils/db')
const ImagesResolve = require('../resolvers/images');
const request = require('request')
const fs = require('fs')


router.get('/makeNew', async (req, res) => {
    const candidates = await Images.findAll({order: [['id', 'ASC']], limit: 5});
    candidates.map(async row => {
        const toDel = await Images.findOne({where:{id:row.id}});
        await toDel.destroy().catch(err=>{
            console.log(err);
        });

        let newImg = await Images.create({title: row.title, path: row.path, rating: row.rating,uid:row.uid,date:row.date,contentType:row.contentType});
        await newImg.save().catch(err => {
            console.log(err);
        });
    })
    res.status(200).json({'Status': 'Done'});
})


router.get('/generateRating', async (req, res) => {
    await sequelize.query("UPDATE `images` SET `rating`=ROUND((RAND() * (1000-500))+500)");

    res.status(200).json({'Status': 'Done'});
})


router.get('/mutateRating', async (req, res) => {
    await sequelize.query("UPDATE `images` SET `rating`=`rating`+ROUND((RAND() * (10--10))+-10)");

    res.status(200).json({'Status': 'Done'});
})




module.exports = router




