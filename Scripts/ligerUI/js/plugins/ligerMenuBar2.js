/**
* jQuery ligerUI 1.2.4
* 
* http://ligerui.com
*  
* Author daomi 2014 [ gd_star@163.com ] 
* 
*/
(function ($) {
    $.fn.ligerMenuBar = function (options) {
        return $.ligerui.run.call(this, "ligerMenuBar", arguments);
    };
    $.fn.ligerGetMenuBarManager = function () {
        return $.ligerui.run.call(this, "ligerGetMenuBarManager", arguments);
    };

    $.ligerDefaults.MenuBar = {};

    $.ligerMethos.MenuBar = {};

    $.ligerui.controls.MenuBar = function (element, options) {
        $.ligerui.controls.MenuBar.base.constructor.call(this, element, options);
    };
    $.ligerui.controls.MenuBar.ligerExtend($.ligerui.core.UIComponent, {
        __getType: function () {
            return 'MenuBar';
        },
        __idPrev: function () {
            return 'MenuBar';
        },
        _extendMethods: function () {
            return $.ligerMethos.MenuBar;
        },
        _render: function () {
            var g = this, p = this.options;
            g.menubar = $(this.element);
            if (!g.menubar.hasClass("pzl-menubar")) g.menubar.addClass("pzl-menubar");
            if (p && p.items) {
                $(p.items).each(function (i, item) {
                    g.addItem(item);
                });
            }
            $(document).click(function () {
                $(".pzl-panel-btn-selected", g.menubar).removeClass("pzl-panel-btn-selected");
            });
            g.set(p);
        },
        addItem: function (item) {
            var g = this, p = this.options;
            var ditem = $('<div class="pzl-menubar-item pzl-panel-btn"><span></span><div class="pzl-panel-btn-l"></div><div class="pzl-panel-btn-r"></div><div class="pzl-menubar-item-down"></div></div>');
            g.menubar.append(ditem);
            item.id && ditem.attr("menubarid", item.id);
            item.text && $("span:first", ditem).html(item.text);
            item.disable && ditem.addClass("l-menubar-item-disable");
            item.click && ditem.click(function () { item.click(item); });
            if (item.menu) {
                var menu = $.ligerMenu(item.menu);
                ditem.hover(function () {
                    g.actionMenu && g.actionMenu.hide();
                    var left = $(this).offset().left;
                    var top = $(this).offset().top + $(this).height();
                    menu.show({ top: top, left: left });
                    g.actionMenu = menu;
                    $(this).addClass("pzl-panel-btn-over pzl-panel-btn-selected").siblings(".pzl-menubar-item").removeClass("pzl-panel-btn-selected");
                }, function () {
                    $(this).removeClass("pzl-panel-btn-over");
                });
            }
            else {
                ditem.hover(function () {
                    $(this).addClass("pzl-panel-btn-over");
                }, function () {
                    $(this).removeClass("pzl-panel-btn-over");
                });
                $(".pzl-menubar-item-down", ditem).remove();
            }

        }
    });

})(jQuery);