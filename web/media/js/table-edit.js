

var TableEditable = function (tableId,inputId) {
    var COLUMN = parseInt($("#"+inputId).value);
    return {

        //main function to initiate the module
        init: function (tableId) {
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }

                oTable.fnDraw();
            }
            
            function editRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                for( var i=0;i<COLUMN;i++){
                    jqTds[i].innerHTML = '<input type="text" style="width:96%;" value="' + aData[i] + '">';
                }
                /*jqTds[0].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[0] + '">';
                jqTds[1].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[2] + '">';
                jqTds[3].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[3] + '">';*/
                jqTds[COLUMN].innerHTML = '<a class="edit" href="">保存</a>';
                jqTds[COLUMN+1].innerHTML = '<a class="cancel" href="">取消</a>';
            }

            function saveRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                for( var i=0;i<COLUMN;i++){
                    oTable.fnUpdate(jqInputs[i].value, nRow, i, false);
                }
                /*oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);*/
                oTable.fnUpdate('<a class="edit" href="">编辑</a>', nRow, COLUMN, false);
                oTable.fnUpdate('<a class="delete" href="">删除</a>', nRow, COLUMN+1, false);
                oTable.fnDraw();
            }

            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                for( var i=0;i<COLUMN;i++){
                    oTable.fnUpdate(jqInputs[i].value, nRow, i, false);
                }
                /*oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);*/
                oTable.fnUpdate('<a class="edit" href="">编辑</a>', nRow, COLUMN, false);
                oTable.fnDraw();
            }

            var oTable = $('#'+tableId).dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_  条记录/页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#'+tableId+'_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#'+tableId+'_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#'+tableId+'_wrapper .dataTables_length select').select2({
                showSearchInput : false //hide search box with special css class
            }); // initialzie select2 dropdown

            var nEditing = null;

            $('#'+tableId+'_new').click(function (e) {
                e.preventDefault();
                var content=[];
                for(var i =0;i<COLUMN;i++){
                    content.push('');
                }
                content.push('<a class="edit" href="">编辑</a>');
                content.push('<a class="cancel" data-mode="new" href="">取消</a>');
                var aiNew = oTable.fnAddData(content);
                /*var aiNew = oTable.fnAddData(['', '', '', '',
                        '<a class="edit" href="">Edit</a>', '<a class="cancel" data-mode="new" href="">Cancel</a>'
                ]);*/
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
            });

            $('#'+tableId+' a.delete').live('click', function (e) {
                e.preventDefault();

                if (confirm("确认删除?") == false) {
                    return;
                }

                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
                alert("Deleted! Do not forget to do some ajax to sync with backend :)");
            });

            $('#'+tableId+' a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });

            $('#'+tableId+' a.edit').live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "保存") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                    alert("Updated! Do not forget to do some ajax to sync with backend :)");
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });
        }

    };

}();