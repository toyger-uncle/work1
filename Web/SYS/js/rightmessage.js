var pz_height = window.screen.availHeight;
pz_height = pz_height - 230;
document.getElementById("contentright").style.height = (pz_height - 248) + "px";
var trHtml = "";
var trHtmlx = "";
var IDK = "0";
var ID = "0";
var IDX = "0";
var TurnTime = 3000;
Initialization();
function Initialization() {
    var response;
    var tbl;
    response = right_controldll.GetRight();
    if (response.error != null) {
        alert(response.error.Message);
        return;
    }
    if (!response.value) {
        return;
    }
    response = right_controldll.GetOpenRecordMaxId();
    if (response.error != null) {
        alert(response.error.Message);
        return;
    }
    ID = response.value;
    IDK = ID;
    response = right_controldll.GetDownRecordMaxId();
    if (response.error != null) {
        alert(response.error.Message);
        return;
    }
    IDX = response.value;
    setTimeout(View, TurnTime);
}
function View() {
    var response;
    var tbl;
    var userinfodiv = document.getElementById("userinfodiv");
    if (userinfodiv.style.display == "none") {
        response = right_controldll.SelDownRecord(IDX);
        if (response.error != null) {
            alert(response.error.Message);
            return;
        }
        tbl = response.value.Tables[0];
        if (tbl.Rows.length > 0) {
            var tblHtml = "<table style= 'width:100%;border-bottom:1px #b4c2cf solid;' cellpadding='0px' cellspacing='0px'>";
            var Html = "";
            for (var i = 0; i < tbl.Rows.length; i++) {
                if (i % 2 == 0) {
                    Html += "<tr class='trp'>";
                }
                else {
                    Html += "<tr class='tr'>";
                }
                Html += "<td style= 'width:25%;' class='td'>" + tbl.Rows[i].case_date.substr(11, 8) + "</td>";
                Html += "<td style= 'width:75%;text-align:left;' class='tdx'>" + tbl.Rows[i].work_status + "</td></tr>";
            }
            trHtmlx = Html + trHtmlx;
            tblHtml += trHtmlx;
            tblHtml += "</table>";
            IDX = (tbl.Rows[0].id).toString();
            document.getElementById("viewindow").innerHTML = tblHtml;
        }
    }
    else {
        response = right_controldll.SelOpenRecord(ID);
        if (response.error != null) {
            alert(response.error.Message);
            return;
        }
        if (response.value == null) {
            return;
        }
        tbl = response.value.Tables[0];
        if (tbl.Rows.length > 0) {
            var tblHtml = "<table style= 'width:100%;border-bottom:1px #b4c2cf solid;' cellpadding='0px' cellspacing='0px'>";
            var Html = "";
            for (var i = 0; i < tbl.Rows.length; i++) {
                if (i % 2 == 0) {
                    Html += "<tr class='trp' ondblclick='UserInfo(this.firstChild.innerHTML)'>";
                }
                else {
                    Html += "<tr class='tr'>";
                }
                Html += "<td style= 'width:0%;display:none;' class='td'>" + tbl.Rows[i].id + "</td>";
                if (tbl.Rows[i].event_reason == "00" || tbl.Rows[i].event_reason == "15" || tbl.Rows[i].event_reason == "22"
                || tbl.Rows[i].event_reason == "23" || tbl.Rows[i].event_reason == "24" || tbl.Rows[i].event_reason == "25"
                || tbl.Rows[i].event_reason == "26" || tbl.Rows[i].event_reason == "27") {
                    Html += "<td style= 'width:10%;' class='td'><img src='../imgs/note_ok.gif' /></td>";
                    if (tbl.Rows[i].event_reason == "26") {
                        PlayMisce(tbl.Rows[i].event_reason, tbl.Rows[i].door_name);
                    }
                }
                else {
                    Html += "<td style= 'width:10%;' class='td'><img src='../imgs/delete.gif' /></td>";
                }
                Html += "<td style= 'width:25%;' class='td'>" + tbl.Rows[i].user_name + "</td>";
                Html += "<td style= 'width:40%;' class='td'>" + tbl.Rows[i].door_name + "</td>";
                Html += "<td style= 'width:25%;' class='tdx'>" + tbl.Rows[i].event_date.substr(11, 8) + "</td></tr>";
            }
            trHtml = Html + trHtml;
            tblHtml += trHtml;
            tblHtml += "</table>";
            ID = (tbl.Rows[0].id).toString();
            document.getElementById("viewindow").innerHTML = tblHtml;
            UserInfo(ID);
        }
    }
    setTimeout(View, TurnTime);
}
function Chang() {
    var userinfoimg = document.getElementById("userinfoimg");
    var userinfotb = document.getElementById("userinfotb");
    var contentright = document.getElementById("contentright");
    if (userinfoimg.title == "折叠") {
        userinfotb.style.display = "none";
        contentright.style.height = (pz_height - 108) + "px";
        userinfoimg.src = "../imgs/user_info_openx.gif";
        userinfoimg.title = "展开";
    }
    else {
        userinfotb.style.display = "block";
        contentright.style.height = (pz_height - 248) + "px";
        userinfoimg.src = "../imgs/user_info_closex.gif";
        userinfoimg.title = "折叠";
    }
}
function Changx(x) {
    var userinfodiv = document.getElementById("userinfodiv");
    var commdiv = document.getElementById("commdiv");
    var contentright = document.getElementById("contentright");
    var tblHtml = "";
    if (x == 0) {
        userinfodiv.style.display = "none";
        commdiv.style.display = "block";
        contentright.style.height = (pz_height - 78) + "px";
        if (trHtmlx != "") {
            tblHtml += "<table style= 'width:100%;border-bottom:1px #b4c2cf solid;' cellpadding='0px' cellspacing='0px'>" + trHtmlx + "</table>";
        }
    }
    else {
        commdiv.style.display = "none";
        userinfodiv.style.display = "block";
        var userinfoimg = document.getElementById("userinfoimg");
        if (userinfoimg.title == "折叠") {
            contentright.style.height = (pz_height - 248) + "px";
        }
        else {
            contentright.style.height = (pz_height - 108) + "px";
        }
        if (trHtml != "") {
            tblHtml += "<table style= 'width:100%;border-bottom:1px #b4c2cf solid;' cellpadding='0px' cellspacing='0px'>" + trHtml + "</table>";
        }
    }
    document.getElementById("viewindow").innerHTML = tblHtml;
}
function UserInfo(id) {
    var response = right_controldll.GetOpenRecordInfo(id);
    if (response.error != null) {
        alert(response.error.Message);
        return;
    }
    var tbl = response.value.Tables[0];
    if (tbl.Rows.length <= 0) {
        return;
    }
    document.getElementById("doornametd").innerHTML = tbl.Rows[0].door_name;
    document.getElementById("usernametd").innerHTML = tbl.Rows[0].user_name;
    document.getElementById("departtd").innerHTML = tbl.Rows[0].department;
    document.getElementById("useridnumtd").innerHTML = tbl.Rows[0].userid_num;
    document.getElementById("eventdatetd").innerHTML = tbl.Rows[0].event_date;
    if (tbl.Rows[0].photo == "" || tbl.Rows[0].photo == null) {
        document.getElementById("photoimg").src = "../imgs/pzcard_pzbz.gif";
    }
    else {
        document.getElementById("photoimg").src = "../photo/" + tbl.Rows[0].photo.trim();
    }
}
function FangDa() {
    window.parent.document.getElementById('right').style.display = 'none';
    window.parent.frames['mainfra'].location.href = 'event_recorder.aspx?ID=' + IDK;
    if (window.parent.document.getElementById('left').style.display == 'none') {
        window.parent.document.getElementById('kg').click();
    }
    window.parent.document.getElementById('kg').click();
}
function PlayMisce(kind, doorname) {
    var Player = document.getElementById("Player");
    Player.controls.stop();
    Player.URL = "../sound/1.wav";
    Player.controls.play();
    alert("胁迫开门:" + doorname);
}