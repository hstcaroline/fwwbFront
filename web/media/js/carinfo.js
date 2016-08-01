var carManageIP = ip + "/CarManage"

jQuery(document).ready(function() {
    App.init();
    TableEditable.init();
    var handlejQueryUIDatePickers = function() {
        $(".ui-date-picker").datepicker();
    };

    var handleDatePickers = function() {

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL()
            });
        }
    };
    handlejQueryUIDatePickers();
    handleDatePickers();
    console.log($("#sample_editable_1"));
    getDate();
    /*($.ajax({
        url: carManageIP+ '/getAllStaff',
        type: 'post',
        success: function(staffList){
            console.log(staffList);
            for(var i=0;i<staffList.length;i++){

            }
        }
    })*/
});

function getDate() {
    $.ajax({
        url: carManageIP + '/getAllBus',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            var oTable = $('#sample_editable_1').dataTable();
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                temp[0] = data[i].id;
                temp[1] = data[i].plate_number;
                temp[2] = data[i].brand;
                temp[3] = data[i].seating;
                temp[4] = data[i].register_date;
                temp[5] = data[i].insurance_date;
                temp[6] = data[i].driving_license;
                temp[7] = "<a class=\"edit\">编辑</a>";
                temp[8] = "<a class=\"remove\">删除</a>";
                oTable.fnAddData(temp);
            }
            console.log(oTable);
        }
    });
}

$("#btnAddStaffByFile").click(function() {
    window.location.href = "StaffInfo";
});

$('#sample_editable_1 a.remove').live('click', function(e) {
    var oTable = $('#sample_editable_1').dataTable();
    var nRow = $(this).parents('tr')[0];
    var jqTds = $('>td', nRow);
    oTable.fnDeleteRow(nRow);
    $.ajax({
        url: carManageIP + '/removeBus',
        type: 'post',
        data: {
            id: jqTds[0].innerHTML
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    });
});
$('#sample_editable_1 a.edit').live('click', function(e) {
    var oTable = $('#sample_editable_1').dataTable();
    var nRow = $(this).parents('tr')[0];
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);
    for (var i = 0; i < 7; i++) {
        jqTds[i].innerHTML = '<input type="text" style="width:96%;" value="' + aData[i] + '">';
    }
    jqTds[7].innerHTML = '<a class="save">保存</a>';
    //jqTds[8].innerHTML = '<a class="cancel">取消</a>';
});
$('#sample_editable_1 a.save').live('click', function(e) {
    var oTable = $('#sample_editable_1').dataTable();
    var nRow = $(this).parents('tr')[0];
    var jqInputs = $('input', nRow);
    for (var i = 0; i < 7; i++) {
        oTable.fnUpdate(jqInputs[i].value, nRow, i, false);
    }
    oTable.fnUpdate('<a class="edit">编辑</a>', nRow, 7, false);
    var aData = oTable.fnGetData(nRow);
    var temp = {};
    temp.id = aData[0];
    temp.plate_number = aData[1];
    temp.brand = aData[2];
    temp.seating = aData[3];
    temp.register_date = aData[4];
    temp.insurance_date = aData[5];
    temp.driving_license = aData[6];
    console.log(temp);
    $.ajax({
        url: carManageIP + '/changeBus',
        type: 'post',
        data: temp,
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    });
    //jqTds[8].innerHTML = '<a class="cancel">取消</a>';
});
$("#btnCarInfoAdd").click(function() {
    var temCar = {};
    temCar.plate_number = $("#plate_number").val();
    temCar.brand = $("#brand").val();
    temCar.seating = $("#seating").val();
    temCar.register_date = $("#register_date").val();
    temCar.insurance_date = $("#insurance_date").val();
    temCar.driving_license = $("#driving_license").val();
    console.log(temCar);
    $.ajax({
        url: carManageIP + '/addCar',
        type: 'post',
        data: {
            carInfo: temCar
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    });
});
