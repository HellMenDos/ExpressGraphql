const sequelize = require('../utils/db-connect')
const Images = require('../models/images')
const Saved = require('../models/saved')
const User = require('../models/user')
const fs = require('fs');
const path = require('path');
const config = require('../config');
const DB = require('../utils/db')
const fetch = require('node-fetch');
const {isAdmin} = require("../utils/helpers");

module.exports = {
    async getNewImages({offsetId, showVideo, onlySubs}) {
        if (!offsetId) {
            offsetId = 9999999;
        }
        const arr = await sequelize.query("SELECT *,(SELECT count(*) FROM `subscribes` WHERE `subscribes`.`follow`=`images`.`uid`)AS `userSubs`" +
            (global.isAuth ? ",(SELECT count(*) FROM `subscribes` WHERE `subscribes`.`follow`=`images`.`uid` AND `subscribes`.`uid`='"+global.user.id+"')AS `subscribed`" : "" )+
            (global.isAuth ? ",(SELECT count(*) FROM seen WHERE seen.iid=images.id AND seen.uid='"+global.user.id+"') AS seenthis" : "" )+
            ",(SELECT `avatar` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userAvatar`" +
            ",(SELECT `rating` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userRating`" +
            ",(SELECT count(*) FROM `comments` WHERE `comments`.`contentId`=`images`.`id`)AS `comments`" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userName` FROM `images` WHERE id NOT IN (SELECT iid FROM seen WHERE uid='"+global.user.id+"') AND `id`<'" + offsetId + "' "+(showVideo ? "":" AND `contentType`='0'")+
            (onlySubs ? " AND `uid` IN (SELECT `follow` FROM `subscribes` WHERE AND `uid`='"+global.user.id+"')" : "")+" ORDER BY `id` DESC LIMIT " + config.IMG_PER_REQ, {type: sequelize.QueryTypes.SELECT});

        arr.forEach((row, idx) => {

            if(arr[idx].contentType==1){
                arr[idx].path = config.IMG_PATH_PREFIX + 'videos/' + arr[idx].path;
            }else {
                arr[idx].path = config.IMG_PATH_PREFIX + 'images/' + arr[idx].path;
            }
            if (arr[idx].userAvatar) {
                arr[idx].userAvatar = config.BASE_URL + '/files/avatar/' + arr[idx].userAvatar;
            } else {
                arr[idx].userAvatar = '/assets/avatar.png';
            }

            if (arr[idx].userRating >= 1000) {
                arr[idx].userRating = Math.ceil(arr[idx].userRating / 1000) + 'k';
            }
        })

        return arr
    },
    async getBestImages({offset, showVideo, onlySubs}) {
        if (!offset) {
            offset = 0;
        }

        const arr = await sequelize.query("SELECT *,(SELECT count(*) FROM `subscribes` WHERE `subscribes`.`follow`=`images`.`uid`)AS `userSubs`" +
            (global.isAuth ? ",(SELECT count(*) FROM `subscribes` WHERE `subscribes`.`follow`=`images`.`uid` AND `subscribes`.`uid`='"+global.user.id+"')AS `subscribed`" : "" )+
            (global.isAuth ? ",(SELECT count(*) FROM seen WHERE seen.iid=images.id AND seen.uid='"+global.user.id+"') AS seenthis" : "" )+
            ",(SELECT `avatar` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userAvatar`" +
            ",(SELECT `rating` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userRating`" +
            ",(SELECT count(*) FROM `comments` WHERE `comments`.`contentId`=`images`.`id`)AS `comments`" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userName` FROM `images`  WHERE id NOT IN (SELECT iid FROM seen WHERE uid='"+global.user.id+"') AND  1 "+(showVideo ? "":" AND `contentType`='0'")+
            (onlySubs ? " AND `uid` IN (SELECT `follow` FROM `subscribes` WHERE `uid`='"+global.user.id+"')" : "")+" ORDER BY `rating` DESC LIMIT " + offset + "," + config.IMG_PER_REQ, {type: sequelize.QueryTypes.SELECT});

        arr.forEach((row, idx) => {
            if(arr[idx].contentType==1){
                arr[idx].path = config.IMG_PATH_PREFIX + 'videos/' + arr[idx].path;
            }else {
                arr[idx].path = config.IMG_PATH_PREFIX + 'images/' + arr[idx].path;
            }

            if (arr[idx].userAvatar) {
                arr[idx].userAvatar = config.BASE_URL + '/files/avatar/' + arr[idx].userAvatar;
            } else {
                arr[idx].userAvatar = '/assets/avatar.png';
            }

            if (arr[idx].userRating >= 1000) {
                arr[idx].userRating = Math.ceil(arr[idx].userRating / 1000) + 'k';
            }
        })

        return arr
    },
    async getNewImagesByUser({uid, offsetId}) {
        if (!offsetId) {
            offsetId = 9999999;
        }

        const arr = await sequelize.query("SELECT *,(SELECT count(*) FROM `subscribes` WHERE `subscribes`.`follow`=`images`.`uid`)AS `userSubs`" +
            (global.isAuth ? ",(SELECT count(*) FROM `subscribes` WHERE `subscribes`.`follow`=`images`.`uid` AND `subscribes`.`uid`='"+global.user.id+"')AS `subscribed`" : "" )+
            ",(SELECT `avatar` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userAvatar`" +
            ",(SELECT `rating` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userRating`" +
            ",(SELECT count(*) FROM `comments` WHERE `comments`.`contentId`=`images`.`id`)AS `comments`" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userName` FROM `images` WHERE `id`<'" + offsetId + "' AND `uid`='"+uid+"'"+
            " ORDER BY `id` DESC LIMIT " + config.IMG_PER_REQ, {type: sequelize.QueryTypes.SELECT});

        arr.forEach((row, idx) => {
            if(arr[idx].contentType==1){
                arr[idx].path = config.IMG_PATH_PREFIX + 'videos/' + arr[idx].path;
            }else {
                arr[idx].path = config.IMG_PATH_PREFIX + 'images/' + arr[idx].path;
            }
            if (arr[idx].userAvatar) {
                arr[idx].userAvatar = config.BASE_URL + '/files/avatar/' + arr[idx].userAvatar;
            } else {
                arr[idx].userAvatar = '/assets/avatar.png';
            }

            if (arr[idx].userRating >= 1000) {
                arr[idx].userRating = Math.ceil(arr[idx].userRating / 1000) + 'k';
            }
        })

        return arr
    },
    async getSavedImages({offset, uid}) {
        if (!offset) {
            offset = 0;
        }

        const arr = await sequelize.query("SELECT *,(SELECT `name` FROM `users` WHERE `users`.`id`=`images`.`uid`)AS `userName` FROM `images` WHERE 1 " +
            " AND `id` IN (SELECT `imageId` FROM `saved` WHERE `uid`='" + uid + "') ORDER BY `rating` DESC LIMIT " + offset + "," + config.IMG_PER_REQ, {type: sequelize.QueryTypes.SELECT});

        arr.forEach((row, idx) => {
            if(arr[idx].contentType==1){
                arr[idx].path = config.IMG_PATH_PREFIX + 'videos/' + arr[idx].path;
            }else {
                arr[idx].path = config.IMG_PATH_PREFIX + 'images/' + arr[idx].path;
            }
        })

        return arr
    },
    async addRating({id, rating, uuid}) {
        let uid=0;

        const candidate = await Images.findOne({where: {id}})
        if (!candidate) {
            throw Error('Content_not_found');
        }

        if (global.isAuth) {
            uid = global.user.id;
            const rated = await DB.count('ratingLogs', {uid: global.user.id, cid: id});
            if(rated){
                return candidate;
            }
        } else {
            const rated = await DB.count('ratingLogs', {uuid, cid: id});
            if(rated){
                return candidate;
            }
        }


        candidate.rating += rating;
        await candidate.save();

        // Начисление рейтинга пользователю
        const user = await User.findOne({where: {id: candidate.uid}});
        if(user) {
            user.rating += rating;
            await user.save();
        }

        await DB.insert('ratingLogs', {uid, uuid, cid: id, rating, date: new Date().toISOString().slice(0, 19).replace('T', ' ')});

        return candidate;
    },
    async seenImages({id}) {
        if (!global.isAuth) {
            throw Error('Only_users');
        }

        const q = await DB.insert('seen',{ uid: global.user.id, iid:id  })
        return 'Done'
    },
    async addToSave({id, uid}) {
        const candidate = await Images.findOne({where: {id}})
        const dubl = await Saved.findOne({where: {uid, imageId: id}});
        if (dubl) {
            return candidate;
        }
        Saved.create({uid, imageId: id})

        // Начисление рейтинга пользователю
        const user = await User.findOne({where: {id: candidate.uid}});
        user.rating += 2;
        await user.save();

        return candidate;
    },
    async delFromSave({id, uid}) {
        const candidate = await Saved.findOne({where: {uid, imageId: id}});

        // Начисление рейтинга пользователю
        const user = await User.findOne({where: {uuid: candidate.uid}});
        user.rating -= 2;
        console.log(user)
        await user.save();

        candidate.destroy();

        return 'Done';
    },
    async deleteImage({id}) {
        if (!global.user.isAdmin) {
            return 'Only admin';
        }
        const candidate = await Images.findOne({where: {id}});
        candidate.destroy().catch(err => {
            console.log(err);
        });
        return 'Done';
    },
    async subscribe({id}) {
        if (!global.isAuth) {
            throw Error('Only_users');
        }
        const candidate = await Images.findOne({where: {id}});

        console.log(global.user.id)
        const subscribed = await DB.count('subscribes',{uid:global.user.id,follow:candidate.uid});
        if(subscribed){
            await DB.delete('subscribes',{uid:global.user.id,follow:candidate.uid},[1]);
            return 0;
        }else{
            await DB.insert('subscribes',{uid:global.user.id,follow:candidate.uid, time: new Date().toISOString().slice(0, 19).replace('T', ' ')});
            return 1;
        }
    },
    async subscribeToUser({uid}) {
        const subscribed = await DB.count('subscribes',{uid:global.user.id,follow:uid});
        if(subscribed){
            await DB.delete('subscribes',{uid:global.user.id,follow:uid},[1]);
            await DB.insert('events',{uid:global.user.id, target: uid, type: 'unsub',date:new Date().toISOString().slice(0, 19).replace('T', ' ')})
            return 0;
        }else{
            await DB.insert('subscribes',{uid:global.user.id,follow:uid, time: new Date().toISOString().slice(0, 19).replace('T', ' ')});
            await DB.insert('events',{uid:global.user.id, target: uid, type: 'sub',date:new Date().toISOString().slice(0, 19).replace('T', ' ')})

            return 1;
        }
    },
    async getCommentsByContent({contentId}) {
        const q = await DB.q("SELECT *" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`comments`.`uid`)AS `fromUserName`" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`comments`.`toUser`)AS `toUserName` FROM `comments` WHERE `contentId`='"+contentId+"' ORDER BY `id` DESC");
        return q;
    },
    async addComment({contentId, message, parentId, toUser}){
        if (!global.isAuth) {
            throw Error('Only_users');
        }
        await DB.insert('comments',{uid: global.user.id, parentId, contentId, toUser, message, date: new Date().toISOString().slice(0, 19).replace('T', ' ')})
        return 1;
    },
    async getUser({uid}) {
        const user = await User.findOne({where: {id: uid}})
        if(isAdmin(user.id)){
            user.isAdmin = true
        }
        if (user.avatar) {
            user.avatar = config.BASE_URL + '/files/avatar/' + user.avatar;
        }
        user.email='';
        user.token='';
        user.uuid='';
        user.password='';

        const subs = await sequelize.query("SELECT count(*)AS `count` FROM `subscribes` WHERE `follow`='" + uid + "'", {type: sequelize.QueryTypes.SELECT});
        user.subscribers=subs[0].count;

        if(global.isAuth) {
            const amISub = await sequelize.query("SELECT count(*)AS `count` FROM `subscribes` WHERE `follow`='" + uid + "' AND `uid`='" + global.user.id + "'", {type: sequelize.QueryTypes.SELECT});
            user.amISubscribed = amISub[0].count;
        }
        return user
    },
    async getUserEvents({uid}) {
        const q = await DB.q("SELECT *" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`events`.`uid`)AS `fromUser`" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`events`.`target`)AS `toUser` FROM `events` WHERE `uid`='"+uid+"' OR `target`='"+uid+"' ORDER BY `id` DESC LIMIT 100");
        return q;
    },
    async getCommentsByUid({uid}) {
        const q = await DB.q("SELECT *" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`comments`.`uid`)AS `fromUserName`" +
            ",(SELECT `name` FROM `users` WHERE `users`.`id`=`comments`.`toUser`)AS `toUserName` FROM `comments` WHERE `uid`='"+uid+"' ORDER BY `id` DESC");
        return q;
    },
    async getContentById({contentId}){
        const candidate = await Images.findOne({where:{id:contentId}});
        if(candidate.contentType==1){
            candidate.path = config.IMG_PATH_PREFIX + 'videos/' + candidate.path;
        }else {
            candidate.path = config.IMG_PATH_PREFIX + 'images/' + candidate.path;
        }
        return candidate;
    },
    // find the same posts in a table
    async findImageByPath(pathurl) {
        img = await DB.count('images',{path:pathurl})
        return img
    },
    // insert posts in a folder
    async SaveImage(pathurl,titlename,uidreq,type) {
      await DB.insert('images',{ path: pathurl, title: titlename,uid: uidreq,date:new Date().toISOString().slice(0, 19).replace('T', ' '),contentType: type })
      return true
    }

}
