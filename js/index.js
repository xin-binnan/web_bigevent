$(function() {
    getUserInfo()

    var layer = layui.layer;
    //点击按钮，实现退出功能----------------------------<<
    $('#btnLoginout').on('click', function() {
        // alert('ok');
        //提示用户是否退出
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清空本地存储的token
            localStorage.removeItem('token');
            //重新跳转登录页面
            location.href = '/login.html';
            //confirm 询问框
            layer.close(index);
        });
    })
});

//获取用户基本信息------------------------------------<<
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            //调用用户头像
            renderAvatar(res.data)
        },
        //无论成功还是失败，最终都会调用 complete 回调函数
        // complete: function(res) {
        //     // console.log('执行了回调函数');
        //     // console.log(res);
        //     //在complete回调函数中，可以使用 responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空token
        //         localStorage.removeItem('token');
        //         //2.强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户头像------------------------------------<<
function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username;
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;' + name);
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文字头像
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(first).show()
    }
}