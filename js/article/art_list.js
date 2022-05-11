$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义美化时间过滤器
    // template.default.imports.dataFormat = function(date) {
    //     const dt = new Date();
    //     var y = dt.getFullYear
    //     var m = padZero(dt.getMonth + 1)
    //     var d = padZero(dt.getDate())
    //     var hh = padZero(dt.getHours())
    //     var mm = padZero(dt.getMinutes())
    //     var ss = padZero(dt.getSeconds())
    //     return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    // };

    //时间补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    };

    initTable();
    initCate();

    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                console.log(res);
                layer.msg('获取文章列表数据成功！');
                //使用模版引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                // console.log(res.total);
                //调用分页
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据数据失败！')
                }
                // console.log(res);
                // layer.msg('获取文章列表数据成功！');

                //使用模版引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);

                //通知layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //查询文章
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选择项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=cate_id]').val();
        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
        layui.use('laypage', function() {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号

                count: total, //数据总数，从服务端得到
                limit: q.pagesize, //每页显示几条数据
                curr: q.pagenum, //设置默认被选中的分页
                //分页发生切换 触发jump回调
                //1.点击页面触发jump回调
                jump: function(obj, first) {
                    //可以通过 first的值 判断是通过哪种方式，触发的jump回调
                    console.log(first);
                    q.pagenum = obj.curr;
                    // initTable()
                    q.pagesize = obj.limit //得到每页显示的条数
                    if (!first) {
                        initTable()
                    }
                },
                limits: [2, 4, 6, 8],
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']

                //2.只要调用了 laypage.render()就会触发jump回调
                // jump: function(obj) {
                //     // console.log(obj.curr);
                //     q.pagenum = obj.curr;
                //     //分根据最新的q获取对应的数据列表，并渲染表格
                //     //这样会导致jump死循环
                //     initTable()
                // }

            });
        });
    }

    //删除
    $('tbody').on('click', '#btn-del', function() {
        //获取删除按钮的个数
        var len = $('#btn-del').length
            // console.log('ok');
            //自定义属性 获取id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')

                    //当数据删除后，要判断当前这一页中，是否加油剩余的数据，如果没有剩余数据了，则让页码值减 1 ，再重新调用initTable()
                    if (len === 1) {
                        //如果len 等于1 就说嘛页面上没有数据了
                        //页码值 最小为1
                        q.pagenum = q.pagenum = 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})