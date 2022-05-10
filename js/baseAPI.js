//注意：每次调用$.post() $.get() $.ajax()的时候，会先调用 ajaxPrefilPrefilter 这个函数
//在这个函数中，可以先拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //发起真正的Ajax请求之前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
    //统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // console.log('执行了回调函数');
        // console.log(res);
        //在complete回调函数中，可以使用 responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空token
            localStorage.removeItem('token');
            //2.强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})