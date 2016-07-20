/**
 * Created by hst on 16/7/18.
 */
/**
 * 日期范围工具类
 */
$(function () { ;
});

function getWeekNum(snum, lnum, id)
{
    var myDate = new Date();
    var day = myDate.getDay();//返回0-6
    //var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    //当天的日期
    var endday;
    var startday;

    endday = getthisDay(-day + lnum); //算得周日
    startday = getthisDay(-day + snum);//算的周一

    $("#"+id).html(startday+'到'+endday);
}
//取得日期
function getthisDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //关键
    var tyear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    if (tDate < 10) {
        tDate = "0" + tDate;
    }
    tMonth = tMonth + 1;
    if (tMonth < 10) {
        tMonth = "0" + tMonth;
    }
    return tyear + "-" + tMonth + "-" + tDate + "";
}

//各种日期取得
function getdaybytype(type) {
    switch (type) {
        case 1:
            getWeekNum(1, 7);
            break;
        case 2:
            getWeekNum(-6,0);
            break;
        case 3:
            getWeekNum(8, 14);
            break;
        default:
            break;
    }
}