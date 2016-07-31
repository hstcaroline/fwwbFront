var extralData;
var oTable;

var TableAdvanced = function () {

    var initTable1 = function (data) {
        extralData = data;
        /*
         * Insert a 'details' column to the table
         */
        var nCloneTh = document.createElement('th');
        var nCloneTd = document.createElement('td');
        nCloneTd.style.cssText = "vertical-align: middle;text-align: center";
        nCloneTd.innerHTML = '<span class="row-details row-details-close"></span>';

        $('#monthScheduleTable thead tr').each(function () {
            this.insertBefore(nCloneTh, this.childNodes[0]);
        });

        $('#monthScheduleTable tbody tr').each(function () {
            this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
        });

        $('#monthScheduleTable a.delete').live('click', function (e) {
            e.preventDefault();
            $("#modal_remove").modal('show');
            $("#remove").click(function () {
                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
                $("#modal_remove").modal('hide');
            });
        });

        /*
         * Initialse DataTables, with no sorting on the 'details' column
         */
        oTable = $('#monthScheduleTable').dataTable({
            "aoColumnDefs": [
                {"bSortable": false, "aTargets": [0]}
            ],
            "aaSorting": [[1, 'asc']],
            "aLengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 5
        });

        jQuery('#monthScheduleTable_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
        jQuery('#monthScheduleTable_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
        jQuery('#monthScheduleTable_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

        /* Add event listener for opening and closing details
         * Note that the indicator for showing which row is open is not controlled by DataTables,
         * rather it is done here
         */
        $('#monthScheduleTable').on('click', ' tbody td .row-details', function () {
            var nTr = $(this).parents('tr')[0];
            if (oTable.fnIsOpen(nTr)) {
                /* This row is already open - close it */
                $(this).addClass("row-details-close").removeClass("row-details-open");
                oTable.fnClose(nTr);
            }
            else {
                /* Open this row */
                $(this).addClass("row-details-open").removeClass("row-details-close");
                oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
            }
        });

    };
    return {
        //main function to initiate the module
        init: function (data) {
            if (!jQuery().dataTable) {
                return;
            }
            initTable1(data);
        }
    };

}();

/* Formating function for row details */
function fnFormatDetails(oTable, nTr) {
    var html = '<table class="table table-bordered table-hover">'
        + '<tr> <th>日期</th>'
        + '<th>时间段</th>'
        + '<th>线路</th>'
        + '<th>司机信息</th>'
        + '<th>车辆信息</th>'
        + '<th>出勤情况</th>'
        + '<th>编辑</th>'
        + '</tr>';
    for (var i in extralData) {
        //当天有未显示的数据
        if (nTr.id == extralData[i].day - 1) {
            var routeLength = extralData[i].driverRoute.length;
            //从第二个开始显示剩余信息
            for (var j = 1; j < routeLength; j++) {
                html += '<tr id="' + (i - 1) + '">';
                html += '<td>' + i + '</td>'
                    + ' <td> 1</td> '
                    + ' <td>2index' + i + '</td> '
                    + '<td>1212A</td>'
                    + '<td >ssww</td>'
                    + '<td > ss</td>'
                    + '<td ><a href="javascript:;" class="btn red mini delete"><i class="icon-trash"></i> 删除</a></td> '
                    + '</tr>';
            }
            html += '</table>';
            return html;
        }
    }
    html += '<td colspan="7">无多余信息</td>'
    html += '</table>';
    return html;

    for (var i = 1; i < 6; i++) {
        html += '<tr id="' + (i - 1) + '">';
        html += '<td>' + i + '</td>'
            + ' <td> 1</td> '
            + ' <td>2index' + i + '</td> '
            + '<td>1212A</td>'
            + '<td >ssww</td>'
            + '<td > ss</td>'
            + '<td ><a href="javascript:;" class="btn red mini delete"><i class="icon-trash"></i> 删除</a></td> '
            + '</tr>';
    }
    html += '</table>';
    return html;
}
var load = function (data) {
    extralData = data;
    oTable.fnDraw();
};