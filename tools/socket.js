

let { isPlainObject, isArray } = require('lodash');
const socketTypeEnum = require('./socketTypeEnum');
const Wechat = require('../lib/wechat.js')
const { DownloadHeadImg } = require('./tool');

global.Users = {};
module.exports = function createSocket(io) {
    io.on('connection', function (socket) {
        let { id } = socket.json;
        Users[id] = {};

        // 根据前台是否返回登录信息来进行不同的处理
        socket.on(socketTypeEnum.loginType, json => {
            let bot;
            try {
                // 之前有登录信息
                if (isPlainObject(JSON.parse(json))) {
                    bot = new Wechat(JSON.parse(json))
                } else {
                    bot = new Wechat()
                }
            } catch (error) {
                bot = new Wechat()
            }

            try {
                if (bot.PROP.uin) {
                    // 存在登录数据时，可以随时调用restart进行重启
                    bot.restart()
                } else {
                    bot.start()
                }
            } catch (error) {
                bot.start()
            }

            /**
             * uuid事件，参数为uuid，根据uuid生成二维码
             */
            bot.on('uuid', uuid => {

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
            bot.on('login', uuid => {

                socket.emit(socketTypeEnum.login, {
                    type: 'login',
                    payload: Users[id].bot.botData
                });
            })

            /**
             * 更新联系人列表
             */
            bot.on('contacts-updated', (contacts = []) => {
                // 取最大的值
                if (!isArray(Users[id].contacts)) Users[id].contacts = []

                if (contacts.length > Users[id].contacts.length) {
                    contacts = contacts.map(item => {
                        item.HeadImgUrl = DownloadHeadImg(bot, item.HeadImgUrl, item.NickName);
                        return item;
                    });

                    Users[id].contacts = contacts;

                    socket.emit(socketTypeEnum.contacts, {
                        type: socketTypeEnum.contacts,
                        payload: contacts
                    });
                }
            })

            /**
             *获取个人头像
             */
            bot.on('user-avatar', avatar => {

                socket.emit(socketTypeEnum.avatar, {
                    type: socketTypeEnum.avatar,
                    payload: { url: avatar }
                });
            })


            /**
             * 断开连接操作
             */
            socket.on(socketTypeEnum.disconnect, function () {
                // 作登出的操作

                Users[id] = void 0;
            });

            // 登录成功后开始监听后面事件
            Users[id].bot = bot;

        })
    });
}