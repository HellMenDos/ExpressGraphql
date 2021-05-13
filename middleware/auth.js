const User = require('../models/user')
const {isAdmin} = require('../utils/helpers');

module.exports = async function (req, res, next) {
    if (req.headers.token) {
        const user = await User.findOne({where: {token: req.headers.token}})
        if (user) {
            if(isAdmin(user.id)){
                user.isAdmin=true;
            }
            global.user = user;
            global.isAuth = true;
        }else {
            try {
                global.user.id = 0;
                global.isAuth = false;
            }catch (e){
                console.log('AuthError', e)
            }
        }
    }
    next()
}
