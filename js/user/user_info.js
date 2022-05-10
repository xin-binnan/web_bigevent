$(function() {
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1-6个字符之间！'
            }
        }
    })
    initUserInfo();

    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                //调用 form.val('lay-filter="" 对应的值', 获取的数据) 快速为表单赋值
                //给哪个表单赋值加form.val()
                form.val('formUserInfo', res.data)
            }
        })
    }
    //表单重置
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    })

    //监听表单事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！');
                //调用父页面的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})