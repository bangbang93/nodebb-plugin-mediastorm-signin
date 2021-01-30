'use strict';

// var topics = require.main.require('./src/topics');
const meta = require.main.require('./src/meta')
const utils = require.main.require('./src/utils')
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
            const cookie = res.headers['set-cookie'][0]
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
        .then(async (uid) => {
            req.session.forceLogin = true
            authenticationController.doLogin(req, uid)
            const settings = await meta.settings.get('core.api')
            settings.tokens = settings.tokens || []
            const newToken = {
                token: utils.generateUUID(),
                uid,
                description: `sigin by wechat ${uid}`,
                timestamp: Date.now(),
            }
            settings.tokens.push(newToken)
            await meta.settings.set('core.api', settings)
            return newToken
        })
        .then((token) => next(null, token))
        .catch(err => {
            console.log(err)
            if(err.response) {
                next(err.response.data)
            } else {
                next(err)
            }
        })
}

module.exports = apiController
