//初始化
(function(){
    //阻止默认行为
    var app = document.querySelector('#app');
    app.addEventListener('touchstart', function(e){
        e.preventDefault();
    });

    //a 链接可点
    var links = document.querySelectorAll('a');
    links.forEach(function(item){
        item.addEventListener('touchstart', function(e){
            //使 链接可以跳转
            //获取 a 元素的 href
            var href = item.getAttribute('href');
            location.href = href;
        });
    });

    //设置 font-size 的值
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';

}());

//顶部的 JS
(function(){
    //顶部的菜单显示与隐藏
    var menuBtn = document.querySelector('.top .pingdao');
    var menuList = document.querySelector('#header .menus');
    //绑定事件
    menuBtn.addEventListener('touchstart', function(){
        //切换频道的图标
        this.classList.toggle('close');
        //切换遮罩层的显示与隐藏
        menuList.classList.toggle('open');
    });

    //input元素可点 并获得焦点
    var input = document.querySelector('.search input');

    input.addEventListener('touchstart', function(e){
        //手动使 input 获得焦点
        input.focus();
        e.stopPropagation();
        e.preventDefault();
    });

    //点击使 input 丧失焦点
    app.addEventListener('touchstart', function(){
        input.blur();
    });

}());

//导航区域的 JS
(function(){
    //获取导航元素
    var nav = document.querySelector('#nav');
    var navList = nav.querySelector('.menu-list');
    var navItems = navList.querySelectorAll('li');

    //绑定事件
    nav.addEventListener('touchstart', function(e){
        //获取触摸点的位置
        this.x = e.targetTouches[0].clientX;
        this.l = transformCSS(navList, 'translateX');
        navList.style.transition = 'none';
        //获取触摸的时间
        this.startTime = (new Date).getTime();
        //检测是否正在触摸滑动
        nav.isTouchMoving = false;
    });

    //触摸移动事件
    nav.addEventListener('touchmove', function(e){
        //修改状态变量的值
        this.isTouchMoving = true;
        //获取触摸移动后的触点位置
        this._x = e.targetTouches[0].clientX;
        var translateX = this._x - this.x + this.l;
        var minTranslateX = - (navList.offsetWidth - nav.offsetWidth);
        //判断是否已经越界
        if(translateX >= 0){
            //方法一
            // translateX = translateX * 0.5;
            //方法二
            var scale = 1 - Math.abs(translateX) / (nav.offsetWidth * 2);
            translateX *= scale;
        }
        if(translateX <= minTranslateX){
            //方法一
            // translateX = minTranslateX + (this._x - this.x) / 2;
            //方法二
            var disX = Math.abs(this._x - this.x);
            var scale = 1 - disX / (nav.offsetWidth * 2);
            translateX = minTranslateX - disX * scale;
        }

        //设置 translateX 的
        transformCSS(navList, 'translateX', translateX);
        e.stopPropagation();
    });

    //触摸结束事件  nav  最外层导航元素
    nav.addEventListener('touchend', function(e){
        //还原状态值
        this.isTouchMoving = false;
        //获取手指抬起的位置
        this._x = e.changedTouches[0].clientX;
        //获取结束的时间
        this.endTime = (new Date).getTime();
        //距离差
        var disX = this._x - this.x;
        //时间差
        var disTime = this.endTime - this.startTime;
        //计算速度
        var v = disX / disTime; //
        // 计算一个位移值
        var distance = v * 100;
        //判断是否越界
        var translateX = transformCSS(navList, 'translateX');
        translateX += distance;
        //计算最小的 translateX
        var minTranslateX = - (navList.offsetWidth - nav.offsetWidth);
        //设置元素的样式过渡效果
        var transition = 'ease-out';
        if(translateX >= 0){
            translateX = 0;
            transition = 'cubic-bezier(.12,.63,.24,1.73)';
        }
        if(translateX < minTranslateX){
            translateX = minTranslateX;
            transition = 'cubic-bezier(.12,.63,.24,1.73)';
        }
        //样式设置
        transformCSS(navList, 'translateX', translateX);
        navList.style.transition = '0.3s transform ' + transition;
		e.stopPropagation();
    });

    //遍历绑定事件
    navItems.forEach(function(item){
        // li 元素
        item.addEventListener('touchend', function () {
            // console.log(nav.isTouchMoving);
            if(nav.isTouchMoving) return;
            //移除同辈元素的 active
            navItems.forEach(function(li){
                li.classList.remove('active');
            });
            //当前元素增减 active
            this.classList.add('active');
        });

    });

}());

//轮播图
(function(){
    //实例化轮播图
    var swiper = new Swiper('#swiper', {
        auto:true,
        loop:true,
        pagination: true,
        time: 3000
    });

}());

//视频区
(function(){
    //获取楼层元素
    var floors = document.querySelectorAll('.floor');

    floors.forEach(function(floor){
        //获取导航元素
        var navItems = floor.querySelectorAll('.nav .item');
        //获取移动边框元素
        var moveBorder = floor.querySelector('.moved-border');
        //由传递选择器   ->  传递对象
        var videos = floor.querySelector('.videos');
        //实例化轮播图
        var swiper = new Swiper(videos, {
            callback: {
                init: function(){
                    // console.log('init');
                },
                start: function(){
                    // console.log('start');
                },
                move: function(){
                    // console.log('move');

                },
                end: function(){
                    //获取当前显示的幻灯片 索引
                    var index = swiper.getIndex();
                    var translateX = moveBorder.offsetWidth * index;
                    //设置
                    transformCSS(moveBorder, 'translateX', translateX);
                    //加载该幻灯片元素的内容
                    //获取第一个幻灯片的内容  (向服务器发送请求,获取新的数据,该位置填充)
                    var swiperItems = floor.querySelectorAll('.swiper-item');
                    // 检测当前的 swiper-item 是否已经加载过
                    var isLoaded = swiperItems[index].getAttribute('is-loaded');
                    if(isLoaded === '1') return;
                    var html = swiperItems[0].innerHTML;
                    setTimeout(function(){
                        //给当前的元素填充内容
                        swiperItems[index].innerHTML = html;
                        swiperItems[index].setAttribute('is-loaded', '1');
                    }, 2000)
                }
            }
        });

        //绑定事件   for(var i=0;i<length;i++)
        navItems.forEach(function(item, key){
            item.key = key;
            item.addEventListener('touchstart', function(){
                //一. 底部边框的位置改变  translateX 控制
                // 当前点击元素的索引有关系  0  0  1  50   2  100  3 150  N  50*N
                // 当前的索引值为 ???
                // 1 根据 offsetLeft translateX / 元素宽度
                // 2 在标签中添加自定义属性  console.log(this.dataset.index);
                // 3 遍历的时候,加入索引 key
                var index = this.key;
                var translateX = moveBorder.offsetWidth * index;
                //设置
                transformCSS(moveBorder, 'translateX', translateX);
                //二. 幻灯片的切换
                swiper.node.switchSlide(index);
            });
        });
    })
}());

//整体竖向滚动
(function(){
    var touchscroll = new Touchscroll('#app','#main');
}());