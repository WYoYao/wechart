
const Wechat = require('./lib/wechat.js')

let bot = new Wechat();

bot.on('uuid', uuid => {
    console.log(uuid);
})

