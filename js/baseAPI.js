//注意：每次调用$.post() $.get() $.ajax()的时候，会先调用 ajaxPrefilPrefilter 这个函数
//在这个函数中，可以先拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //发起真正的Ajax请求之前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})