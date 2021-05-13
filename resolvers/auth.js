const User = require('../models/user')
const genPass = require('generate-password')
const bcrypt = require('bcryptjs')
const mailer = require('../utils/mailer')
const validator = require('validator')

module.exports = {
    async lostPassword({email}) {
        if (!email) {
            throw Error('Empty_email');
        }
        const candidate = await User.findOne({where: {email}})
        if (!candidate){
            throw Error('Email_not_exists');
        }

        const newPassword = genPass.generate({length: 8, numbers: true})
        const newToken = genPass.generate({length: 32, numbers: true})

        candidate.password = await bcrypt.hash(newPassword, 10)
        candidate.token = newToken
        await candidate.save()

        mailer(email, 'New password', `Your email: ${email}\nYour new password is: ${newPassword}`)

        return true
    },
    async login({email, password}) {

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.findOne({where: {email}})

        if (!user) {
            throw new Error('Wrong_email_or_password')
        }
        const matchPassword = await bcrypt.compare(password, user.password)
        console.log(matchPassword);
        if (!matchPassword) {
            throw new Error('Wrong_email_or_password')
        }


        const newToken = genPass.generate({length: 32, numbers: true})

        user.token = newToken

        await user.save()

        return user
    },
    async register({email, password, name, uuid}) {

        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            throw new Error('Email_already_exists')
        }
        if (!validator.isEmail(email)) {
            throw new Error('Email_not_valid')
        }
        if (!validator.isLength(password, {min: 3})) {
            throw new Error('Password_min_length')
        }

        const checkUUID = await User.findOne({where: {uuid}})
        if (checkUUID) {
            uuid = genPass.generate({length: 36, numbers: true})
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const token = genPass.generate({length: 32, numbers: true})

        // const rid = global.cookies.rid || 0
        // const pid = global.cookies.pid || 0


        const user = new User({
            email, token, password: hashPassword, name, uuid, regDate: Date.now()//, rid, pid
        })

        await user.save()

        mailer(email, 'Successful registration', `Your email: ${email}\nYour password: ${password}`)

        return user
    },
    async authByGoogle({userId, email, name, uuid}){
        const isUser = await User.findOne({where: {googleUserId: userId}});
        if(isUser){ // Если userId уже есть то возвращаем данные юзера для авторизации
            return isUser;
        }else{
            const isEmail = await User.findOne({where: {email}})
            if(isEmail){ // Если userId нет, но есть такой email то привязываем его к гуглу и возвращаем данные авторизации
                isEmail.googleUserId=userId;

                await isEmail.save();

                return isEmail;
            }else{
                const checkUUID = await User.findOne({where: {uuid}})
                if (checkUUID) {
                    uuid = genPass.generate({length: 36, numbers: true})
                }
                const hashPassword = await bcrypt.hash(uuid, 10)
                const token = genPass.generate({length: 32, numbers: true})
                console.log({
                    email, token, password: hashPassword, name, uuid, regDate: Date.now()//, rid, pid
                });
                const user = new User({
                    email, token, password: hashPassword, name, uuid, regDate: Date.now(), googleUserId: userId//, rid, pid
                })

                await user.save()

                mailer(email, 'Successful registration', `Your email: ${email}\nYour password: ${password}`)

                return user
            }
        }




    },
    async authByFacebook({userId, email, name, uuid}){
        const isUser = await User.findOne({where: {facebookauth: userId}});
        if(isUser){ // Если userId уже есть то возвращаем данные юзера для авторизации
            return isUser;
        }else{
            const isEmail = await User.findOne({where: {email}})
            if(isEmail){ // Если userId нет, но есть такой email то привязываем его к гуглу и возвращаем данные авторизации
                isEmail.facebookauth=userId;

                await isEmail.save();

                return isEmail;
            }else{
                const checkUUID = await User.findOne({where: {uuid}})
                if (checkUUID) {
                    uuid = genPass.generate({length: 36, numbers: true})
                }
                const hashPassword = await bcrypt.hash(uuid, 10)
                const token = genPass.generate({length: 32, numbers: true})
                console.log({
                    email, token, password: hashPassword, name, uuid, regDate: Date.now()//, rid, pid
                });
                const user = new User({
                    email, token, password: hashPassword, name, uuid, regDate: Date.now(), facebookauth: userId//, rid, pid
                })

                await user.save()

                mailer(email, 'Successful registration', `Your email: ${email}\nYour password: ${password}`)

                return user
            }
        }
   
    }
}
