/**
 * Created by hst on 16/7/13.
 */
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

function getXlsFromTbl(inTblId, inWindow) {
    try {
        var allStr = "";
        var curStr = "";
        var fileName = getExcelFileName();
        if (inTblId != null && inTblId != "" && inTblId != "null") {
            var hh = isIE();
            if (hh == true) //IE浏览器
            {
                curStr = getTblData(inTblId, inWindow);
                if (curStr != null) {
                    allStr += curStr;
                }
                else {
                    alert("你要导出的表不存在");
                    return;
                }
                doFileExport(fileName, allStr);
            } else {
                curStr = getTblData1(inTblId, inWindow);
                if (curStr != null) {
                    allStr += curStr;
                }
                else {
                    alert("你要导出的表不存在");
                    return;
                }
                var uri = 'data:text/xls;charset=utf-8,\ufeff' + encodeURIComponent(allStr);
                //创建a标签模拟点击下载
                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
    }
    catch (e) {
        alert("导出发生异常:" + e.name + "->" + e.description + "!");
    }

}

function getTblData(inTbl, inWindow) {
    var rows = 0;
    var tblDocument = document;
    if (!!inWindow && inWindow != "") {

        if (!document.all(inWindow)) {
            return null;
        }
        else {
            tblDocument = eval(inWindow).document;
        }
    }

    var curTbl = tblDocument.getElementById(inTbl);
    var outStr = "";

    if (curTbl != null) {

        for (var j = 0; j < curTbl.rows.length; j++) {
            for (var i = 0; i < curTbl.rows[j].cells.length; i++) {
                var s = curTbl.rows[j].cells[i].innerText;
                s = s.replace(",", "");

                outStr += s + "\t";//\t

                if (curTbl.rows[j].cells[i].colSpan > 1) {
                    for (var k = 0; k < curTbl.rows[j].cells[i].colSpan - 1; k++) {
                        outStr += "\t";//\t
                    }
                }
                if (i == 0) {
                    if (rows == 0 && curTbl.rows[j].cells[i].rowSpan > 1) {
                        rows = curTbl.rows[j].cells[i].rowSpan - 1;
                    }
                }
            }

            outStr += "\r\n";

        }

    }

    else {
        outStr = null;
        alert(inTbl + "不存在 !");
    }
    return outStr;
}


function getTblData1(inTbl, inWindow) {
    var rows = 0;
    var tblDocument = document;
    if (!!inWindow && inWindow != "") {
        if (!document.all(inWindow)) {//用对象id来引用一个特定的对象
            return null;
        }
        else {
            tblDocument = eval(inWindow).document;
        }
    }

    //当前的table
    var curTbl = tblDocument.getElementById(inTbl);
    var outStr = "";

    if (curTbl != null) {

        for (var j = 0; j < curTbl.rows.length; j++) {
            for (var i = 0; i < curTbl.rows[j].cells.length; i++) {
                var s = curTbl.rows[j].cells[i].innerText;
                if(s=="编辑"||s=="删除"){
                    continue;
                }
                s = s.replace(",", " ");

                outStr += s + ",";//\t

                if (curTbl.rows[j].cells[i].colSpan > 1) {
                    for (var k = 0; k < curTbl.rows[j].cells[i].colSpan - 1; k++) {
                        outStr += ",";//\t
                    }
                }
                if (i == 0) {
                    if (rows == 0 && curTbl.rows[j].cells[i].rowSpan > 1) {
                        rows = curTbl.rows[j].cells[i].rowSpan - 1;
                    }
                }
            }
            outStr += "\r\n";
            console.log(outStr);
        }
    }

    else {
        outStr = null;
        alert(inTbl + "不存在 !");
    }
    return outStr;
}
function getExcelFileName() {
    var d = new Date();
    var curYear = d.getYear();
    var curMonth = "" + (d.getMonth() + 1);
    var curDate = "" + d.getDate();
    var curHour = "" + d.getHours();
    var curMinute = "" + d.getMinutes();
    var curSecond = "" + d.getSeconds();
    if (curMonth.length == 1) {
        curMonth = "0" + curMonth;
    }

    if (curDate.length == 1) {
        curDate = "0" + curDate;
    }

    if (curHour.length == 1) {
        curHour = "0" + curHour;
    }

    if (curMinute.length == 1) {
        curMinute = "0" + curMinute;
    }

    if (curSecond.length == 1) {
        curSecond = "0" + curSecond;
    }
    var fileName = "table" + "_" + curYear + curMonth + curDate + "_"
        + curHour + curMinute + curSecond + ".csv";
    return fileName;
}

function doFileExport(inName, inStr) {
    var xlsWin = null;
    if (!!document.all("glbHideFrm")) {
        xlsWin = glbHideFrm;
    }
    else {
        var width = 6;
        var height = 4;
        var openPara = "left=" + (window.screen.width / 2 - width / 2)
            + ",top=" + (window.screen.height / 2 - height / 2)
            + ",scrollbars=no,width=" + width + ",height=" + height;
        xlsWin = window.open("", "_blank", openPara);
    }
    xlsWin.document.write(inStr);
    xlsWin.document.close();
    xlsWin.document.execCommand('Saveas', true, inName);
    xlsWin.close();

}
//function checkAll() {
//    var allCheckBoxs = document.getElementsByName('preCheck');
//    var desc = document.getElementById("allChecked");
//    var selectOrUnselect = false;
//    for (var i = 0; i < allCheckBoxs.length; i++) {
//        if (allCheckBoxs[i].checked) {
//            selectOrUnselect = true;
//            break;
//        }
//    }
//    if (selectOrUnselect) {
//        _allUnchecked(allCheckBoxs);
//    } else {
//        _allchecked(allCheckBoxs);
//    }
//}
//function _allchecked(allCheckBoxs) {
//    for (var i = 0; i < allCheckBoxs.length; i++) {
//        allCheckBoxs[i].checked = true;
//    }
//}
//function _allUnchecked(allCheckBoxs) {
//    for (var i = 0; i < allCheckBoxs.length; i++) {
//        allCheckBoxs[i].checked = false;
//    }
//}


