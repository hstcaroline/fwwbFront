var data=[];
data[0]={gender:"男",dept:"人力资源部",group:"A1组",job:"经理",content:"略"};
data[1]={gender:"男",dept:"行政部",group:"B1组",job:"组长",content:"略"};
data[2]={gender:"女",dept:"行政部",group:"B1组",job:"副组长",content:"略"};
data[3]={gender:"男",dept:"运输部",group:"C2组",job:"组长",content:"略"};

var TableAdvanced = function () {

    var initTable1 = function() {

        /* Formating function for row details */
        function fnFormatDetails ( oTable, nTr )
        {
            var aData=data[parseInt(nTr.id)%data.length];
            //var aData = oTable.fnGetData( nTr );
            var sOut = '<table>';
            sOut += '<tr><td>性别:</td><td>'+aData.gender+'</td></tr>';
            sOut += '<tr><td>部门:</td><td>'+aData.dept+'</td></tr>';
            sOut += '<tr><td>组别:</td><td>'+aData.group+'</td></tr>';
            sOut += '<tr><td>职位:</td><td>'+aData.job+'</td></tr>';
            sOut += '<tr><td>工作简介:</td><td>'+aData.content+'</td></tr>';
            sOut += '</table>';
            return sOut;
        }

        /*
         * Insert a 'details' column to the table
         */
        var nCloneTh = document.createElement( 'th' );
        var nCloneTd = document.createElement( 'td' );
        nCloneTd.style.cssText="vertical-align: middle;text-align: center";
        nCloneTd.innerHTML = '<span class="row-details row-details-close"></span>';
         
        $('#sample_1 thead tr').each( function () {
            this.insertBefore( nCloneTh, this.childNodes[0] );
        } );
         
        $('#sample_1 tbody tr').each( function () {
            this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
        } );

        $('#sample_1 a.delete').live('click', function (e) {
            e.preventDefault();
            $("#modal_remove").modal('show');
            $("#remove").click (function () {
                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
                $("#modal_remove").modal('hide');
            });
        });
        
        /*
         * Initialse DataTables, with no sorting on the 'details' column
         */
        var oTable = $('#sample_1').dataTable( {
            "aoColumnDefs": [
                {"bSortable": false, "aTargets": [ 0 ] }
            ],
            "aaSorting": [[1, 'asc']],
             "aLengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 5,
        });

        jQuery('#sample_1_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
        jQuery('#sample_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
        jQuery('#sample_1_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown
         
        /* Add event listener for opening and closing details
         * Note that the indicator for showing which row is open is not controlled by DataTables,
         * rather it is done here
         */
        $('#sample_1').on('click', ' tbody td .row-details', function () {
            var nTr = $(this).parents('tr')[0];
            if ( oTable.fnIsOpen(nTr) )
            {
                /* This row is already open - close it */
                $(this).addClass("row-details-close").removeClass("row-details-open");
                oTable.fnClose( nTr );
            }
            else
            {
                /* Open this row */                
                $(this).addClass("row-details-open").removeClass("row-details-close");
                oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
            }
        });
    };
    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            initTable1();
        }
    };

}();