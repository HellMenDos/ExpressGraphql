const {Router} = require('express')
const router = Router()
const fs = require('fs')
const path = require('path')
const genPass = require('generate-password')
const User = require('../models/user')
const ContentModeration = require('../models/content-moderation')




router.post('/avatar', async (req, res) => {



        let filedata = req.file;
    if(filedata){
            const candidate = await User.findOne({where: {id: global.user.id}});
            if (!candidate) {
                throw Error('Not_user');
            }

            candidate.avatar = filedata.filename;

            await candidate.save();

        res.status(200).json({Status: 'Success'});
    }
})


router.post('/image', async (req, res) => {

    let filedata = req.file;
    if(filedata){
             const candidate = await new ContentModeration({
                    uid: global.user.id,
                    path: filedata.filename,
                    title: '',
                    date: Date.now()
                });
                candidate.save();
        res.status(200).json({Status: 'Success'});
    }


})

module.exports = router
