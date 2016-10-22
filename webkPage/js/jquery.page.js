/**
 * wbkpaging v2.0.5
 * require jquery 1.7+
 * MIT License
 * for more info pls visit :https://github.com/wayou/SlipHover
 */

;
(function($, window, document, undefined) {

    // Create the defaults once
    var pluginName = "wbkpaging",
        defaults = {
            callback: null,
            pagesize: 10,
            current: 1,
            prevTpl: "上一页",
            nextTpl: "下一页",
            firstTpl: "首页",
            lastTpl: "末页",
            ellipseTpl: "...",
            toolbar: false,
            hash:true,
            pageSizeList: [5, 10, 15, 20]
        };

    function webkPage(element, options) {
        var nums = Math.random().toString().replace('.', '');
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._name = pluginName;
        this.id = 'Page_' + nums;
        this.init();
    }

    webkPage.prototype = {
        init: function() {
            this.target = $(this.element);
            this.container = $('<div id="' + this.id + '" class="page-container"/>');
            this.target.append(this.container);
            this.hander(this.settings);
            this.strHtml();
            this.bindEvent();
        },
        hander: function(ops) {
            this.count = ops.count || this.settings.count;//总数量
            this.pagesize = ops.pagesize || this.settings.pagesize;//每页显示的数量
            this.current = ops.current || this.settings.current;//当前页
            this.pagecount = Math.ceil(this.count / this.pagesize);//总页数
            this.strHtml();
        },
        bindEvent: function() {
            var _this = this;
            this.container.on('click', 'li.page-action,li.wek-page', function(e) {
                if ($(this).hasClass('pager-disabled') || $(this).hasClass('focus')) {
                    return false;
                }
                if ($(this).hasClass('page-action')) {
                    if ($(this).hasClass('page-first')) {
                        _this.current = 1;
                    }
                    if ($(this).hasClass('page-prev')) {
                        _this.current = Math.max(1, _this.current - 1);
                    }
                    if ($(this).hasClass('page-next')) {
                        _this.current = Math.min(_this.pagecount, _this.current + 1);
                    }
                    if ($(this).hasClass('page-last')) {
                        _this.current = _this.pagecount;
                    }
                } else if ($(this).data('page')) {
                    _this.current = parseInt($(this).data('page'));
                }
                _this.pageJump();
            });
        },
        pageJump: function(p) {
            var _this = this;
            this.current = p || this.current;
            this.current = Math.max(1, _this.current);
            this.current = Math.min(this.current, _this.pagecount);
            this.strHtml();
            this.settings.callback && this.settings.callback(this.current, this.pagesize, this.pagecount);
        },
        strHtml: function() {
            var str = new Array();
            var result;
            str.push('<ul>');
            str.push('<li class="page-first page-action wek-page" >' + this.settings.firstTpl + '</li>');
            str.push('<li class="page-prev page-action wek-page">' + this.settings.prevTpl + '</li>');
            if (this.pagecount > 6) {
                if (this.current <= 4) {
                    str.push('<li data-page="1" class="wek-page">1</li>');
                    str.push('<li data-page="2" class="wek-page">2</li>');
                    str.push('<li data-page="3" class="wek-page">3</li>');
                    str.push('<li data-page="4" class="wek-page">4</li>');
                    str.push('<li data-page="5" class="wek-page">5</li>');
                    str.push('<li class="paging-ellipse">' + this.settings.ellipseTpl + '</li>');
                } else if (this.current > 4 && this.current <= this.pagecount - 3) {
                    str.push('<li>' + this.settings.ellipseTpl + '</li>');
                    str.push('<li data-page="' + (this.current - 2) + '" class="wek-page">' + (this.current - 2) + '</li>');
                    str.push('<li data-page="' + (this.current - 1) + '" class="wek-page">' + (this.current - 1) + '</li>');
                    str.push('<li data-page="' + this.current + '" class="wek-page">' + this.current + '</li>');
                    str.push('<li data-page="' + (this.current + 1) + '" class="wek-page">' + (this.current + 1) + '</li>');
                    str.push('<li data-page="' + (this.current + 2) + '" class="wek-page">' + (this.current + 2) + '</li>');
                    str.push('<li class="paging-ellipse" class="wek-page">' + this.settings.ellipseTpl + '</li>');
                } else {
                    str.push('<li class="paging-ellipse" >' + this.settings.ellipseTpl + '</li>');
                    for (var i = this.pagecount - 4; i <= this.pagecount; i++) {
                        str.push('<li data-page="' + i + '" class="wek-page">' + i + '</li>');
                    }
                };
            } else {
                for (var i = 1; i <= this.pagecount; i++) {
                    html += '<li data-page="' + i + '" class="wek-page">' + i + '</li>'
                }
            }
            str.push('<li class="page-next page-action wek-page">' + this.settings.nextTpl + '</li>');
            str.push('<li class="page-last page-action wek-page">' + this.settings.lastTpl + '</li>');
            str.push('</ul>');
            result = str.join('');
            this.container.html(result);
            if (this.current == 1) {
                $('.page-prev', this.container).addClass('pager-disabled');
                $('.page-first', this.container).addClass('pager-disabled');
            }
            if (this.current == this.pagecount) {
                $('.page-next', this.container).addClass('pager-disabled');
                $('.page-last', this.container).addClass('pager-disabled');
            }
            this.container.find('li[data-page="' + this.current + '"]').addClass('focus').siblings().removeClass('focus');
            if (this.settings.toolbar) {
                this.bindToolbar();
            }
        },
        bindToolbar: function() {
            var _this = this;
            var html = $('<li class="paging-toolbar"><input type="text" class="paging-count"/><a href="javascript:void(0)">跳转</a></li>');
            $('input', html).click(function() {
                $(this).select();
            }).keydown(function(e) {
                if (e.keyCode == 13) {
                    var current = parseInt($(this).val()) || 1;
                    _this.pageJump(current);
                }
            });
            $('a', html).click(function() {
                var current = parseInt($(this).prev().val()) || 1;
                _this.pageJump(current);
            });
            this.container.children('ul').append(html);
        }

    };

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "page_" + pluginName)) {
                $.data(this, "page_" + pluginName, new webkPage(this, options));
            }
        });
        return this;
    };

})(jQuery, window, document);