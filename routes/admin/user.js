const {Router} = require('express')
const router = Router()
const {isAdmin} = require('../../utils/helpers')
const DB = require('../../utils/db')
const Users = require('../../models/user');

router.get('/:id', async (req, res) => {

    const user = await Users.findOne({where:{id: req.params.id}});
    if(!user){
        res.html('User_not_exists');
    }

    const saved = await DB.count('saved',{uid:user.uuid});
    const subscriptions = await DB.count('subscribes',{uid:user.id});
    const followers = await DB.count('subscribes',{follow:user.id});

    res.render('user', {
        title: 'Просмотр профиля',
        isUser: true,
        user: user.dataValues,
        count: {saved, subscriptions, followers}
    })
})


module.exports = router
