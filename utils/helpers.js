const config = require('../config');

function isAdmin(uid){
    if(config.ADMIN_IDS.includes(uid)){
        return true;
    }
    return false;
}

exports.isAdmin=isAdmin
