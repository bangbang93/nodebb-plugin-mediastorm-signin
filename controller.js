'use strict';

// var topics = require.main.require('./src/topics');
// var meta = require.main.require('./src/meta');
const axios = require('axios')
axios.defaults.withCredentials = true

const user = require.main.require('./src/user')
const authenticationController = require.main.require('./src/controllers/authentication')

const apiController = {}

apiController.wechatProxy = async function (req, next) {
    // TODO: 改成配置域名
    axios.post('https://test.ysjf.com/api/forum/decrypt', req.body)
        .then(async (res) => {
            const data = res.data
            const cookie = res.headers['Set-Cookie']
            let forumId = data.forumId
            if (!forumId) {
                throw new Error({message: "登录失败"})
            }
            if (forumId === -1) {
                // 创建用户 + 绑定到网站
                forumId = await user.create({
                    username: data.nickname,
                    email: data.mail ?? `${data.phone}@ysjf-fake-email.com`
                })
                await axios.post('https://test.ysjf.com/api/forum/bind', {forumId}, {
                    headers: {
                        Cookie: cookie,
                    },
                })
            }
            return forumId
        })
        .then(uid => {
            req.session.forceLogin = true
            authenticationController.doLogin(req, uid)
        })
        .then(() => next(null, {message: 'success'}))
        .catch(err => {
            if(err.response) {
                next(err.response.data)
            } else {
                next(err)
            }
        })
    console.log(req.body)
}

module.exports = apiController
