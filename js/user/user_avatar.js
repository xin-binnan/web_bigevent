$(function() {
    var layer = layui.layer;
    //获取裁剪区DOM元素
    var $image = $('#image');
    //配置选项
    const options = {
            //纵横比
            aspectRatio: 1,
            // aspectRatio: 16/9,
            //指定预览区域
            preview: '.img-preview'
        }
        //创建裁剪区域
    $image.cropper(options);

    //上传图片
    $('#btnChooseImg').on('click', function() {
        $('#file').click()
    })
    $('#file').on('change', function(e) {
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择需要上传的图片！')
        }
        // layer.msg('上传成功')
        // 拿到用户选择的文件
        var file = e.target.files[0];
        //将文件转化为路径
        var imgURL = URL.createObjectURL(file);
        //重新初始化裁剪区域
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', imgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    });;

    //确定上传
    $('#btnUpload').on('click', function() {
        // 1.拿到用户裁剪后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                //创建一个画布
                width: 100,
                height: 100,
            })
            .toDataURL('image/png'); //将Canvas 画布上的内容， 转化为base64格式的字符串
        // 2.调用接口，上传服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})