const User = require('../models/user')
const config = require('../config')
const sequelize = require('../utils/db-connect')
const {isAdmin} = require('../utils/helpers')
const DB = require('../utils/db')

module.exports = {
    async getUsersByPage({amount,page,name}) {
        const arr = await sequelize.query(`SELECT *,(SELECT count(*) FROM subscribes WHERE subscribes.follow = users.id) AS userSubs `+(global.isAuth ? ",(SELECT count(*) FROM subscribes WHERE subscribes.follow=users.id AND subscribes.uid='"+global.user.id+"')AS subscribed" : "" )+` FROM users WHERE id > 99  AND  id < 1000 AND name LIKE '%${name}%' ORDER BY id DESC LIMIT ${page},${amount}`, {type: sequelize.QueryTypes.SELECT});

        return arr

    },
    async getUserData() {
        const user = await User.findOne({where: {id: global.user.id}})
        if(isAdmin(user.id)){
            user.isAdmin = true
        }
        if (user.avatar) {
            user.avatar = config.BASE_URL + '/files/avatar/' + user.avatar;
        }
        const subs = await sequelize.query("SELECT count(*)AS `count` FROM `subscribes` WHERE `follow`='" + global.user.id + "'", {type: sequelize.QueryTypes.SELECT});
        user.subscribers=subs[0].count;

        return user
    },
    async ChangeData({name,email,descr}) {
        
        const user = await DB.update('users',{ name,email,descr },{id:global.user.id});
        console.log(user)
        return user
    },
    async premiumSum({premium}) {
        
        const user = await DB.update('users',{ premium },{id:global.user.id});
        console.log(user)
        return user
    },
    async subscribe({id}) {
        if (!global.isAuth) {
            throw Error('Only_users');
        }
        const candidate=await User.findOne({where:{id}});
        if(!candidate){
            throw Error('No_image');
        }


        const subscribed = await DB.count('subscribes',{uid:global.user.id,follow:candidate.id});
        if(subscribed){
            await DB.delete('subscribes',{uid:global.user.id,follow:candidate.id},[1]);
            return 0;
        }else{
            await DB.insert('subscribes',{uid:global.user.id,follow:candidate.id, time: new Date().toISOString().slice(0, 19).replace('T', ' ')});
            return 1;
        }
    },
    async newPassword({password, oldPassword}) {
        const passwordMatch = await bcrypt.compare(oldPassword, global.user.password)
        if (!passwordMatch) {
            throw new Error('Old_password_dont_match')
        }

        const newToken = genPass.generate({length: 32, numbers: true})

        const user = await User.findOne({where: {id: global.user.id}})

        user.password = await bcrypt.hash(password, 10)
        user.token = newToken

        await user.save()

        return user
    },
    async exit() {
        const newToken = genPass.generate({length: 32, numbers: true})
        const user = await User.findOne({where: {id: global.user.id}})
        user.token = newToken
        await user.save()
        return user
    }
}
