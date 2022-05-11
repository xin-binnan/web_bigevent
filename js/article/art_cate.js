$(function() {
    var layer = layui.layer;
    // form快速将获取来的数据添加到form表单
    var form = layui.form;
    //获取文章类别列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //添加分类
    var indexAdd = null;

    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '252px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    //通过代理的形式，为 form-add 表单绑定submit事件
    //事件委托
    // $("ol").on("click", "li", function() {
    //     alert('1');
    // })
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式，为 btn-edit 按钮绑定事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        // var indexEdit = null;
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '252px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })

    })

    //提交修改后的数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layer.msg('更新数据成功！')
                layer.close(indexEdit)
                initArtCateList()

            }
        })
    })
    $('tbody').on('click', '#btn-del', function() {
        // console.log('ok');
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })

})