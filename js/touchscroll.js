(function (w) {
    /**
     * 函数
     * 名字   Touchscroll
     * 参数
     *      outer,   最外层包裹元素
     *      inner    内容区元素
     * 示例
     *      var touchscroll = new Touchscroll('#app','#main');
     * 注意:
     *     1. 增加单独 CSS 文件
     *     2. 通过 JS 脚本来设置 CSS 样式
     *     3. 通过用户的配置, 动态创建滚动条, 并设置样式
     *     .scroll-bar{
                position:absolute;
                right:0;
                top:0;
                width:4px;
                height:100px;
                background:rgba(0,0,0,0.7);
                z-index:10;
            }
     */

    function Touchscroll(outer, inner) {
        var app = document.querySelector(outer);
        var main = document.querySelector(inner);
        var content = document.querySelector('#content');
        var scrollBar = document.querySelector('.scroll-bar');
        app.addEventListener('touchstart', function (e) {
            e.preventDefault();
        });

        //初始化
        app.init = function () {
            //滚动条的高度设置
            var h = app.offsetHeight / main.offsetHeight * app.offsetHeight;
            scrollBar.style.height = h + 'px';
            console.log(app.offsetHeight , main.offsetHeight , app.offsetHeight);
            //给外层包裹元素增加 相对定位
            app.style.position = 'relative';
        }
        window.addEventListener('load', function(){
            app.init();
        })

        //绑定事件
        app.addEventListener('touchstart', function (e) {
            main.style.transition = 'none';
            this.y = e.targetTouches[0].clientY;
            this.t = transformCSS(main, 'translateY');
            this.startTime = (new Date()).getTime();
            //停止定时器  main[translateY].timer
            if (main['translateY'] && main['translateY'].timer) {
                clearInterval(main['translateY'].timer);
            }

            if (scrollBar['top'] && scrollBar['top'].timer) {
                clearInterval(scrollBar['top'].timer);
            }
        });

        app.addEventListener('touchmove', function (e) {
            this._y = e.targetTouches[0].clientY;
            var translateY = this._y - this.y + this.t;
            //
            var minTranslateY = -(main.offsetHeight - app.offsetHeight);
            if (translateY > 0) {
                translateY = translateY / 2;
            }
            if (translateY < minTranslateY) {
                var disY = (this._y - this.y) / 2;
                translateY = minTranslateY + disY;
            }

            transformCSS(main, 'translateY', translateY);
            //计算滚动条的位置
            var t = -translateY / main.offsetHeight * app.offsetHeight;
            scrollBar.style.top = t + 'px';
        });

        app.addEventListener('touchend', function (e) {
            this._y = e.changedTouches[0].clientY;
            var translateY = this._y - this.y + this.t;
            var minTranslateY = -(main.offsetHeight - app.offsetHeight);
            this.endTime = (new Date()).getTime();
            var disY = this._y - this.y;
            var disTime = this.endTime - this.startTime;

            var speed = disY / disTime;
            translateY += speed * 100;
            //判断
            var type = 'quinteaseOut';
            if (translateY > 0) {
                translateY = 0;
                type = 'backEaseOut';
            }
            if (translateY <= minTranslateY) {
                translateY = minTranslateY;
                type = 'backEaseOut';
            }
            // 动画效果就是 从 当前的 translateY  ->  增加了惯性位移的 translateY
            var currentTranslate = transformCSS(main, 'translateY');
            tweenAnimation(main, currentTranslate, translateY, 'translateY', 500, 10, type, 3);
            //计算出惯性移动之后的位置
            var t = -translateY / main.offsetHeight * app.offsetHeight;
            //获取当前的 滚动条的位置
            var currentTop = scrollBar.offsetTop;
            tweenAnimation(scrollBar, currentTop, t, 'top', 500, 10, type, 3);
        });

    }

    //赋值
    w.Touchscroll = Touchscroll;

})(window)