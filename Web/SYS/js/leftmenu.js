$(function () {

    $("#accordion1").ligerAccordion(
                {
                    height: 300
                });
});
 UserLogin();
 function UserLogin() {
     Ajax(true, "/lg/GetListForID", { user_id: '0000000000' }, function (data) {
                    if (!data.Success) {
                        alert(data.Message);
                        return;
                    }
                    $.cookie('LocalID', data.Ex);
                    window.location.href = "Web/SYS/leftmenu.htm";
                })
            }     