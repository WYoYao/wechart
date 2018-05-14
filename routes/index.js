var express = require('express');
var router = express.Router();
const Wechat = require('../lib/wechat.js')
const { isString, isUndefined } = require('lodash');
const { Response } = require('../tools/tool');

const Users = {};

/* GET home page. */
router.all('/', function (req, res, next) {
  //  用户之前未登录过的情况
  if (isString(req.cookies.token) && req.cookies.token.length) {
    res.send('https://login.weixin.qq.com/qrcode/');
  } else {
    var wechat = new Wechat();
    Users[req.ip.toString()] = wechat;

    wechat.on('uuid', uuid => {

      res.send(new Response({
        url: 'https://login.weixin.qq.com/qrcode/' + uuid
      }));

    });

    wechat.start();
  }
});
module.exports = router;
