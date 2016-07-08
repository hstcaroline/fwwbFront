function csv(url,titleId,contentId) {
    $.get(url, function (record) {
        //按回车拆分
        record = record.split(/\n/);
        //第一行标题
        var title = record[0].split(",");
        for(var c=0;c<title.length;c++){
            var th = "<th>" + title[c] + "</th>";
            $("#"+titleId).append(th);
        }
        //删除第一行
        record.shift();
        var data = [];
        for (var row = 0; row < record.length; row++) {
            //每行数据
            var t = record[row].split(",");
            //遍历所有列
            $("#"+contentId).append("<tr>");
            for (var col = 0; col < t.length; col++) {
                if (!data[row])
                    data[row] = {};
                data[row][title[col]] = t[col];
                var column = "<td>"+t[col]+"</td>"
                $("#"+contentId).append(column);
            }
            $("#"+contentId).append("</tr>");
        }
        //数据存储为data[i].title
        //$("#result").html(data[0].姓名);
        data = null;
    });
}