var tab = null;
var accordion = null; 
var tabItems = [];
var LocalID = $.cookie("LocalID");
var skins = $.cookie("skins");
var scene = $.cookie("scene");//场景
var lan = $.cookie("lan");
$(function () {
    //初始化
    if (skins == null) {
        skins = "aq";
    }
    if (scene == null) {
        scene = "lang";
    }
    if (lan == null) {
        lan = "ch";
    }
    $("head").append("<link href=\"../" + global.skin_links[skins] + "\" rel=\"stylesheet\" type=\"text/css\"></script>");
    $("head").append("<script src=\"../Scripts/scene_" + scene + "_" + lan + ".js\" type=\"text/javascript\"></script>");
    $(document).attr("title", scene.title["mainpage"]);
    var skinSelect = $("#skinSelect");
    skinSelect.empty();
    jsAddItemToSelect(skinSelect, "aq", scene.pageattr["default"]);
    //jsAddItemToSelect(skinSelect, "gr", pageattr["gray"]);
    //jsAddItemToSelect(skinSelect, "sy", pageattr["silvery"]);
    //jsAddItemToSelect(skinSelect, "wt", pageattr["white"]);
    skinSelect.val(skins);
    var languageSelect = $("#languageSelect");
    languageSelect.empty();
    jsAddItemToSelect(languageSelect, "ch", scene.pageattr["chinese"]);
    //jsAddItemToSelect(languageSelect, "en", pageattr["english"]);//英文暂时不用
    languageSelect.val(lan);
    $("#quit").html(scene.pageattr["logout"]);
    $("#help").html(scene.pageattr["help"]);
    Ajax(true, global.sys["GetUserFile"], { LoginID: LocalID, id: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#info").html(scene.pageattr["welcome"] + data.Data.user_name + scene.pageattr["use"] + scene.title["mainpage"]);
    });

    $("#quit").click(function () { logout(); });
    $("#help").click(function () {
        var manager = $.ligerDialog.tip({ width: 180, content: "未完成！" });
        setTimeout(function () { manager.close(); }, 2000);
    });
    Ajax(true, global.lg["GetCompanyName"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#companyname").html(data.Data);
    });
    Ajax(true, global.sys["GetProjectList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var htm = "<ul>";
        for (var i = 0; i < data.Data.length; i++) {
            htm += "<li onclick=\"DisplayMenu('" + data.Data[i].id + "');\">" + scene.projectname[data.Data[i].id] + "</li>";
        }
        htm += "</ul>";
        $("#projectlist").html(htm);
        DisplayMenu("1");
    });
    $("#layout").ligerLayout({ topHeight: 80, leftWidth: 150, rightWidth: 250, bottomHeight: 20,
        allowLeftResize: false, allowRightResize: false, allowTopResize: false, allowBottomResize: false, allowCenterBottomResize: false
    });
    var height = $(".l-layout-center").height();
    $("#framecenter").ligerTab({
        height: height,
        showSwitchInTab: true,
        showSwitch: true,
        onAfterAddTabItem: function (tabdata) {
            tabItems.push(tabdata);
            saveTabStatus();
        },
        onAfterRemoveTabItem: function (tabid) {
            for (var i = 0; i < tabItems.length; i++) {
                var o = tabItems[i];
                if (o.tabid == tabid) {
                    tabItems.splice(i, 1);
                    saveTabStatus();
                    break;
                }
            }
        },
        onReload: function (tabdata) {
            var tabid = tabdata.tabid;
            addFrameSkinLink(tabid);
        }
    });
    $("#accordion").ligerAccordion({
        height: height - 24, speed: null
    });
    tab = liger.get("framecenter");
    accordion = liger.get("accordion");
    $("#pageloading").hide();
    css_init();
    pages_init();
});
function DisplayMenu(projectidvalue) {
    var leftHead = $("DIV.l-layout-header-inner");
    leftHead[0].innerText = scene.projectname[projectidvalue];
    leftHead[1].innerText = scene.title["realmessage"];
    Ajax(true, global.sys["GetGroupAndModuleListProject"], { LoginID: LocalID, projectid: projectidvalue }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var html = "";
        var findfirst = true;
        var find = false;
        for (var i = 0; i < data.Data.length; i++) {
            var item = $('<div title="' + scene.modulegroupname[data.Data[i].id] + '"><ul class="menulist"></ul></div>');
            find = false;
            for (var j = 0; j < data.Ex.length; j++) {
                if (data.Data[i].id == data.Ex[j].modulegroupid) {
                    find = true;
                    var subitem = $('<li><img/><span></span><div class="menuitem-l"></div><div class="menuitem-r"></div></li>');
                    subitem.attr({ url: global.moduleurl[data.Ex[j].id], menuno: data.Ex[j].id, tabid: data.Ex[j].id });
                    $("img", subitem).attr("src", global.moduleimgs[data.Ex[j].id]);
                    $("span", subitem).html(scene.modulename[data.Ex[j].id]);
                    $("ul:first", item).append(subitem);
//                    if (findfirst && tabItems.length == 0) {
//                        findfirst = false;
//                        var tabid = data.Ex[j].id;
//                        var url = moduleurl[data.Ex[j].id];
//                        if (!url) return;
//                        if (!tabid) {
//                            tabidcounter++;
//                            tabid = "tabid" + tabidcounter;
//                            jitem.attr("tabid", tabid);

//                            if (url.indexOf('?') > -1) url += "&";
//                            else url += "?";
//                            url += "MenuNo=" + data.Ex[j].id;
//                            jitem.attr("url", url);
//                        }
//                        f_addTab(tabid, modulename[data.Ex[j].id], url);
//                    }
                }
            }
            if (find) {
                html += item[0].outerHTML;
            }
        }
        //重新绑定Accordion
        $("#accordion").ligerAccordion('reload', html);
        //模块动态绑定事件
        $("ul.menulist li").live('click', function () {
            var jitem = $(this);
            var tabid = jitem.attr("tabid");
            var url = jitem.attr("url");
            if (!url) return;
            if (!tabid) {
                tabidcounter++;
                tabid = "tabid" + tabidcounter;
                jitem.attr("tabid", tabid);

                if (url.indexOf('?') > -1) url += "&";
                else url += "?";
                url += "MenuNo=" + jitem.attr("menuno");
                jitem.attr("url", url);
            }
            f_addTab(tabid, $("span:first", jitem).html(), url);
        }).live('mouseover', function () {
            var jitem = $(this);
            jitem.addClass("l-link-over");
        }).live('mouseout', function () {
            var jitem = $(this);
            jitem.removeClass("l-link-over");
        });
    });
}
function logout() {
    Ajax(true, global.sys["UserLogout"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $.cookie('liger-home-tab', '[]');
        $.cookie("LocalID", 0, { path: '/', expires: -1 });
        $.cookie("psw", 0, { path: '/', expires: -1 });
        $.cookie("liger-home-tab", 0, { path: '/', expires: -1 });
        window.location.href = "../newlogin.htm";
    });
}
$.ligerMethos.Accordion.reload = function (html) {
    this.accordion.html(html);
    this._render();
};
var hc = [{ "id": "14" }, { "id": "15" }, { "id": "16" }, { "id": "17" }, { "id": "107" }, { "id": "108" }, { "id": "119" }, { "id": "120" }
, { "id": "121" }, { "id": "122" }, { "id": "129" }, { "id": "130" }, { "id": "133" }, { "id": "207" }, { "id": "227" }, { "id": "228" }, { "id": "231" }
, { "id": "232" }, { "id": "234" }, { "id": "251" }, { "id": "252" }, { "id": "262" }, { "id": "266" }, { "id": "268" }, { "id": "307" }, { "id": "308" }, { "id": "700"}];
function f_addTab(tabid, text, url) {
    var tabJson = $.cookie('liger-home-tab');
    if (tabJson) {
        for (var j = 0; j < hc.length; j++) {
            if (tabid != hc[j].id) {
                var x = f_removeTab(hc[j].id);
            }
        }
    }
    tab.addTabItem({
        tabid: tabid,
        text: text,
        url: url,
        callback: function () {
            addFrameSkinLink(tabid);
        }
    });
}
function f_removeTab(tabid) {
    tab.removeTabItem(tabid); 
} 
function addFrameSkinLink(tabid) {
    var prevHref = getLinkPrevHref(tabid) || "";
    var skin = getQueryString("skin");
    if (!skin) return;
    skin = skin.toLowerCase();
    attachLinkToFrame(tabid, prevHref + skin_links[skin]);
}
function pages_init() {
    var tabJson = $.cookie('liger-home-tab');
    if (tabJson) {
        var tabitems = JSON2.parse(tabJson);
        for (var i = 0; tabitems && tabitems[i]; i++) {
            f_addTab(tabitems[i].tabid, tabitems[i].text, tabitems[i].url);
        }
    }
}
function saveTabStatus() {
    $.cookie('liger-home-tab', JSON2.stringify(tabItems));
}
function css_init() {
    var css = $("#mylink").get(0), skin = getQueryString("skin");
    $("#skinSelect").val(skin);
    $("#skinSelect").change(function () {
        if (this.value) {
            $.cookie('skins', this.value);
            location.href = "homepage.htm?skin=" + this.value;
        } else {
            location.href = "homepage.htm";
        }
    });
    if (!css || !skin) return;
    skin = global.skin_keyvalue[skin].toLowerCase();
    $('body').addClass("body-" + global.skin_keyvalue[skin]);
    $(css).attr("href", "../" + global.skin_links[skin]);
}
function attachLinkToFrame(iframeId, filename) {
    if (!window.frames[iframeId]) return;
    var head = window.frames[iframeId].document.getElementsByTagName('head').item(0);
    var fileref = window.frames[iframeId].document.createElement("link");
    if (!fileref) return;
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    head.appendChild(fileref);
} 
function getLinkPrevHref(iframeId) {
    if (!window.frames[iframeId]) return;
    var head = window.frames[iframeId].document.getElementsByTagName('head').item(0);
    var links = $("link:first", head);
    for (var i = 0; links[i]; i++) {
        var href = $(links[i]).attr("href");
        if (href && href.toLowerCase().indexOf("ligerui") > 0) {
            return href.substring(0, href.toLowerCase().indexOf("lib"));
        }
    }
}