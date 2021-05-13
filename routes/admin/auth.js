const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator')
const User = require('../../models/user')
const router = Router()
const {isAdmin} = require('../../utils/helpers')


router.get('/login', async (req, res) => {


    res.render('login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({where: {email}})

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/admin')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/admin/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/admin/login')
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
