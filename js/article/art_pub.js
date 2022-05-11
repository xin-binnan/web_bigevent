$(function() {
    var layer = layui.layer
    var form = layui.form;
    //初始化文章分类的方法
    initCate();
    // initEditor()

    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    };

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // console.log(res);
                // layer.msg('获取文章列表数据成功！');

                //使用模版引擎渲染数据
                var htmlStr = template('tpl-pub', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);

                //通知layui 重新渲染表单区域的UI结构
                //不调用 form.render() 表单分类数据渲染不出来
                form.render()
            }
        })
    }

    //获取裁剪区DOM元素
    var $image = $('#image');
    //配置选项
    const options = {
            //纵横比
            aspectRatio: 1,
            aspectRatio: 400 / 280,
            //指定预览区域
            preview: '.img-preview'
        }
        //创建裁剪区域
    $image.cropper(options);

    $('#btn-image').on('click', function() {
        // console.log('ok');
        $('#coverFile').click()
    })

    //监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        //获取文件列表数组
        var files = e.target.files
            // 判断用户是否选择了图片
        if (files.length === 0) {
            return
        }
        //将文件转化为路径
        var newImgURL = URL.createObjectURL(files[0]);
        //重新初始化裁剪区域
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })

    //定义文章发布的状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        var art_state = '草稿'
    })

    //为表单绑定submit 事件
    $("#form-pub").on('submit', function(e) {
        e.preventDefault();
        // 1. 基于 form 表单，快速创建一个FormData 对象
        var fd = new FormData($(this)[0]);

        //2.将文章的发布状态，存到fd中
        fd.append('state', art_state);

        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        //3.将封面裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                //创建一个画布
                width: 400,
                height: 280,
            })
            .toBlob(function(blob) {
                //4.将文件对象存到 fd 中
                fd.append('cover_img', blob);

            });
        // console.log('1');
        //6.发起 ajax 请求 
        pubishArticle(fd);
    })

    function pubishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意；如果想服务器提交的是 FormData 格式的数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布成功！');
                //发布文章成功后跳到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})