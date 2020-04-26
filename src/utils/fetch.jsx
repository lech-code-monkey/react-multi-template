/**
 * Encapsulation of the fetch method
 */
import { Toast } from 'antd-mobile'
import config from '../configs/index'

class Fetch {
    static Fetch_last_url = {} // 之前请求的URL信息
 
    /**
     * Asynchronous         异步
     * @param url           请求地址api
     * @param params        请求参数
     * @param headers       请求头参数（非必传）
     */
    static async post (url, params = {}, headers = {}) {
        params = params || {}

        // 重复请求校验
        if (Fetch.Fetch_last_url[url] === JSON.stringify(params)) {
            return
        }
        Fetch.Fetch_last_url[url] = JSON.stringify(params)
        
        // headers['Access-Control-Allow-Origin'] = '*'
        // 获取token信息
        try {
            if (localStorage.sessionToken) {
                headers['token'] = localStorage.sessionToken + ''
            }
        } catch (error) {}

        params = Fetch.manageParams(params)
        
        // 参数封装
        let uriParams = new FormData()
        if (params) {
            Object.keys(params).forEach(key => {
                uriParams.append(key, params[key])
            })
        }

        return new Promise((resolve, reject) => {
            fetch(config.postUrl + url, {
                method: 'POST',
                headers,
                mode: 'cors',
                body: uriParams,
                // credentials: 'include'
            }).then((response) => {
                Fetch.Fetch_last_url[url] = null
                if (response.ok) {
                    return response.json()
                } else {
                    reject({success: false, errCode:'500', errDesc: '服务器异常，请稍后重试'})
                }
            }).then((respResult) => {
                if (respResult && respResult.code) {
                    switch (respResult.code) {
                    case 200:   // 成功
                        resolve(respResult.ret)
                        break
                    case 406:   // 会话已过期，请重新登陆
                        Fetch.reLoginFunc()
                        break
                    case 2001:   // APP OR PC API 认证失败
                        Fetch.reLoginFunc()
                        break
                    default :
                        respResult.msg && Toast.info(respResult.msg)
                        reject(respResult)
                        break
                    }
                } else {
                    reject({success: false, errCode:'500', msg: '网络异常，请稍后重试'})
                }
            }).catch((error) => {
                Fetch.Fetch_last_url[url] = null
                error.msg && Toast.info(error.msg)
                reject({success: false, errCode:'500', error: error.msg})
            })
        })
    }

    /**
     * 参数处理（处理数组或对象的value，格式：数组arr[i]、对象obj.key）
    */
    static manageParams(params) {
        for (let key in params) {
            let item = params[key]
            if (item && item !== '' && item !== null && item !== undefined) {
                if (Array.isArray(item)) {
                    // 数组
                    item.forEach((val, i) => {
                        if (val.constructor === Object || val.constructor === File || typeof val === 'string' || typeof val === 'number') {
                            params[`${key}[${i}]`] = val
                        }
                    })

                    delete params[key]
                    Fetch.manageParams(params)
                } else if (item.constructor === Object && !_isImgFile(item)) {
                    // 对象
                    for (let i in item) {
                        params[`${key}.${i}`] = item[i]
                    }
                    delete params[key]
                    Fetch.manageParams(params)
                }
            }
        }

        let allString = false
        for (let key in params) {
            let item = params[key]
            if (typeof item === 'string' || typeof item === 'number' || item === null || item.constructor === File) {
                allString = true
            }
        }
        if (allString) {
            return params
        }

        // 非图片
        function _isImgFile(obj) {
            if (obj['size'] && obj['type'] && obj['name']) {
                return true
            }
            return false
        }
    }

    /**
     * 退出登录
     */
    static reLoginFunc () {
    }
}

export default Fetch