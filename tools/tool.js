'use strict'
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Response {
    constructor(content, state = 200, message = '') {
        return {
            content,
            state,
            message
        }
    }
}

function DownloadHeadImg(bot, HeadImgUrl, NickName) {
    // 如果是空直接返回
    if (!HeadImgUrl || !NickName) return;

    const secret = 'leo';
    console.log(NickName);
    const hash = crypto.createHmac('sha256', secret)
        .update(NickName)
        .digest('hex');

    let url = path.resolve(__dirname, `../public/img/${hash}.jpg`);
    if (!fs.existsSync(url)) {
        bot.getHeadImg(HeadImgUrl).then(res => {
            fs.writeFileSync(url, res.data)
        }).catch(err => {
            bot.emit('error', err)
        })
    }

    return `/img/${hash}.jpg`;
}

module.exports = {
    Response,
    DownloadHeadImg
}