var data=[];
data[0]={route:true,driver:true,car:true,staff:true,intro:'最高权限'};
data[1]={route:true,driver:true,car:true,staff:true,intro:'最高权限'};
data[2]={route:false,driver:true,car:true,staff:false,intro:'统筹管理司机工作及车辆行驶'};
data[3]={route:false,driver:false,car:false,staff:true,intro:'统筹管理公司人力资源'};
data[4]={route:false,driver:false,car:false,staff:true,intro:'审核员工乘车需求及变更申请'};
data[5]={route:false,driver:false,car:false,staff:true,intro:'管理公司员工档案'};
data[6]={route:false,driver:false,car:true,staff:false,intro:'管理公司车辆档案'};
data[7]={route:true,driver:false,car:false,staff:false,intro:'管理站点及路线，定期上报乘车数据'};
var FormWizard = function () {
    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            $("#department_list").select2({
                placeholder: "部门",
                allowClear: true,
                escapeMarkup: function (m) {
                    return m;
                }
            });
            $("#group_list").select2({
                placeholder: "组别",
                allowClear: true,
                escapeMarkup: function (m) {
                    return m;
                }
            });
            $("#job_list").select2({
                placeholder: "岗位",
                allowClear: true,
                escapeMarkup: function (m) {
                    return m;
                }
            });
            $("#role_list").select2({
                placeholder: "角色",
                allowClear: true,
                escapeMarkup: function (m) {
                    return m;
                }
            });
            $("#role_list").change(function() {
                var i = parseInt($("#role_list").get(0).selectedIndex);
                var info=document.getElementById("info");
                var content="";
                if(data[i].route==false){
                    content='<p><span class="label" id="authority_route">厂车班次管理</span>';
                }else{
                    content='<p><span class="label label-success" id="authority_route">厂车班次管理</span>';
                }
                if(data[i].driver==false){
                    content+=' <span class="label" id="authority_driver">司机排班管理</span>';
                }else{
                    content+=' <span class="label label-success" id="authority_driver">司机排班管理</span>';
                }
                if(data[i].car==false){
                    content+=' <span class="label" id="authority_car">车辆信息管理</span>';
                }else{
                    content+=' <span class="label label-success" id="authority_car">车辆信息管理</span>';
                }
                if(data[i].staff==false){
                    content+=' <span class="label" id="authority_staff">员工信息管理</span></p>';
                }else{
                    content+=' <span class="label label-success" id="authority_staff">员工信息管理</span></p>';
                }
                content+=' <div class="alert">角色说明： '+data[i].intro+'</div>';
                info.innerHTML=content;
            });

            var form = $('#submit_form');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'validate-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //account
                    id: {
                        equallength: 5,
                        required: true
                    },
                    password: {
                        minlength: 6,
                        required: true
                    },
                    rpassword: {
                        minlength: 6,
                        required: true,
                        equalTo: "#submit_form_password"
                    },
                    //profile
                    fullname: {
                        required: true
                    },
                    gender: {
                        required: true
                    },
                    group: {
                        required: true
                    },
                    department: {
                        required: true
                    },
                    //authority
                    role: {
                        required: true
                    }
                },

                messages: {},

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.attr("name") == "gender") { // for uniform radio buttons, insert the after the given container
                        error.addClass("no-left-padding").insertAfter("#form_gender_error");
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavoir
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit   
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "gender" ) { // for checkboxes and radip buttons, no need to show OK icon
                        label
                            .closest('.control-group').removeClass('error').addClass('success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid ok') // mark the current input as valid and display OK icon
                        .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            var displayConfirm = function() {
                $('.display-value', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    }else if ($(this).attr("data-display") == 'gender') {
                        var gender = "";
                        $('[name="gender"]').each(function(){
                            if($(this).attr('checked')=='checked'){
                                gender=($(this).attr('data-title'));
                            }
                        });
                        $(this).html(gender);
                    }
                });
            };

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index) {
                    //alert('on tab click disabled');
                    return false;
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var progress = parseInt(current*100/total);
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text(progress+"%");
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                        displayConfirm();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }
                    App.scrollTo($('.page-title'));
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var progress = parseInt(current*100/total);
                    // set wizard title
                    $('.step-title', $('#form_wizard_1')).text(progress+"%");
                    // set done steps
                    jQuery('li', $('#form_wizard_1')).removeClass("done");
                    var li_list = navigation.find('li');
                    for (var i = 0; i < index; i++) {
                        jQuery(li_list[i]).addClass("done");
                    }

                    if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current >= total) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('.button-submit').show();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('.button-submit').hide();
                    }

                    App.scrollTo($('.page-title'));
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {
                $.gritter.add({
                    title: '<p style="font-family: 微软雅黑">请稍候</p>',
                    text: '<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在注册...',
                    sticky: false,
                    time: '2000'
                });
            }).hide();
        }

    };

}();