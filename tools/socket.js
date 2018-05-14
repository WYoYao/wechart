

let { isPlainObject } = require('lodash');
const socketTypeEnum = require('./socketTypeEnum');
const Wechat = require('../lib/wechat.js')

global.Users = {};
module.exports = function createSocket(io) {
    io.on('connection', function (socket) {
        let { id } = socket.json;

        // 用户未登录
        if (!isPlainObject(Users[id])) {
            Users[id] = new Object();
            Users[id].bot = new Wechat();
            Users[id].bot.start()
        }



        socketTypeEnum.loginType;

        /**
         * uuid事件，参数为uuid，根据uuid生成二维码
         */
        Users[id].bot.on('uuid', uuid => {

            socket.emit(socketTypeEnum.qrcode, {
                type: 'setImageUrl',
                payload: {
                    url: `https://login.weixin.qq.com/qrcode/${uuid}`,
                }
            });
        })

        /**
         * 登录成功事件
         */
        Users[id].bot.on('login', uuid => {

            socket.emit(socketTypeEnum.login, {
                type: 'login',
                payload: Users[id].bot.botData
            });
        })

        socket.on(socketTypeEnum.disconnect, function () {
            // 作登出的操作

            Users[id] = void 0;
        });
    });
}