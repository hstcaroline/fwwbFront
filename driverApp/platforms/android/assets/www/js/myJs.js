/**
 * Created by hst on 16/7/7.
 */
//var ip = 'http://115.159.218.128:3000/';
var ip = 'http://192.168.1.7:3000/';
function footerClick(id) {
    if (id == "footer_a1") {
        location.href = "index.html";
    }
    if (id == "footer_a2") {
        location.href = "mySchedule.html";
    }
    if (id == "footer_a3") {
        location.href = "nfcScan.html";
    }
}
function menuClick(id) {
    if (id == 'myInfo') {
        location.href = 'myInfo.html';
    }
    if (id == 'myCash') {
        location.href = 'myCash.html';
    }
    if (id == 'myMsg') {
        location.href = 'myMsg.html';
    }
    if(id=='myCar'){
        location.href = 'myCar.html';
    }
    if(id=='news'){
        location.href = 'news.html';
    }
}
function formatTime(index) {
    switch (index) {
        case 1:
            return '00:00-02:00';
        case 2:
            return '02:00-04:00';
        case 3:
            return '04:00-06:00';
        case 4:
            return '06:00-08:00';
        case 5:
            return '08:00-10:00';
        case 6:
            return '10:00-12:00';
        case 7:
            return '12:00-14:00';
        case 8:
            return '14:00-16:00';
        case 9:
            return '16:00-18:00';
        case 10:
            return '18:00-20:00';
        case 11:
            return '20:00-22:00';
        case 12:
            return '22:00-24:00';
        default:
            return '10:00-12:00';
    }
}
function formatStatus(status){
    if(status=='ok'){
        return "可用";
    }
    return "不可用";

}