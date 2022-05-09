$(function() {
    //点击去注册账号链接
    $('#link_red').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    });
    $('#link_red').on('mouseover', function() {
        $(this).css('color', '#75CCF3')
    });

    //点击去登录链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });
    $('#link_login').on('mouseover', function() {
        $(this).css('color', '#75CCF3')
    });

    //从lay UI 获取form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        //自定义一个pwd规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        repwd: function(value) {
            //再次确认密码与密码val比较
            var pwd = $('.reg-box [name = password]').val();
            if (pwd !== value) {
                return '两次输入的密码不一致!'
            }
        }
    })

    //监听表单注册事件
    //注册
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录!');
            //模拟人的点击行为
            $('#link_login').click()
                // $('#form_reg [name=username]').val() = ''
                // $('#form_reg [name=password]').val() = ''
        });


    });
    //登录
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登录成功!');
                //将登录成功得到的 token 字符串，保存到localStorage 中
                localStorage.setItem('token', res.token);
                //跳到后台主页
                location.href = '/index.html'
            }
        })
    })
})