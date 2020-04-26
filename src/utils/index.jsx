/*
 * 图片压缩，默认同比例压缩
 * @param {Object} path
 *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
 * @param {Object} obj
 *   obj 对象 有 width， height， quality(0-1)
 * @param {Object} callback
 */
function PhotoCompress(file,w,objDiv){
    var ready = new FileReader()
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file)
    ready.onload = function(){
        var re = this.result
        canvasDataURL(re,w,objDiv)
    }
}

/**
 * @param {*} path 
 * @param {*} obj 
 * @param {*} callback 
 */
function canvasDataURL(path, obj, callback){
    var img = new Image()
    img.src = path
    img.onload = function(){
        var that = this
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h
        w = obj.width || w
        h = obj.height || (w / scale)
        var quality = 0.7  // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        // 创建属性节点
        var anw = document.createAttribute('width')
        anw.nodeValue = w
        var anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        // 图像质量
        if(obj.quality && obj.quality <= 1 && obj.quality > 0){
            quality = obj.quality
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality)
        // 回调函数返回base64的值
        callback(base64)
    }
}

/**
 * @param {*} urlData 
 */
function convertBase64UrlToBlob(urlData){
    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
    while(n--){
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type:mime})
}

/**
 * 获取图片地址
 * @param {*} file 
 */
function getObjectURL(file) {
    let url = null
    if (window.createObjcectURL !== undefined) {
        url = window.createOjcectURL(file)
    } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
    }

    return url
}

/**
 * 获取客户端平台类型
 */
function getPlatform () {
  var userAgent = navigator.userAgent.toLowerCase()
  var name = 'Unknown'
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows'
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Ios'
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac'
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix'
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android'
    } else {
      name = 'Linux'
    }
  } else {
    name = 'Unknown'
  }
  return name
}

/**
  * log
  * @param {string} message 
  * @param {*} data 
  */
function log (message, data) {
  var log = document.getElementById('log')
  if (log) {
    var el = document.createElement('div')
    el.className = 'logLine'
    el.innerHTML = message + '：====== ' + JSON.stringify(data) + ' ======'
    if (log.children.length) { log.insertBefore(el, log.children[0]) } else { log.appendChild(el) } 
  } else {
    console.log(message + '：====== ' + JSON.stringify(data) + ' ======')
  }
}


export {
    PhotoCompress,
    convertBase64UrlToBlob,
    getObjectURL,
    getPlatform,
    log
}