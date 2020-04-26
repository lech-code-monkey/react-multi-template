/**
 * 配置项
 */
var config = {
    env: 'test', // 当前环境
}

let appConfig = {  // 开发环境（内部）
    dev: {
        postUrl: 'http://xxqa-admin.eyuntx.com/'
    },
    // 测试环境（内部）
    test: {
        postUrl: 'http://test.security-api.szscmc.com/'
    },
    // 线上环境（内部）
    online: {
        postUrl: 'http://security-api.szscmc.com/'
    }
}

config = Object.assign(config, appConfig[config.env])

export default config
