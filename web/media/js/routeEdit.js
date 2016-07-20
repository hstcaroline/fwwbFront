//var routs = [{
//    "route": {"id": 1, "name": "route", "time": null, "status": "ok"},
//    "stations": [{
//        "id": 1,
//        "name": "station",
//        "address": "station",
//        "posx": 123,
//        "posy": 123,
//        "time": "2016-07-18T22:16:24.000Z"
//    }]
//}];
//var block_data = [14, 13, 13, 3, 3, 13, 3, 15, 6, 7, 8, 9, 14, 17];
var routes = [];
var COLOR = ["#FF9900", "#333333", "#548C00", "##009933", "#CC0066", "#009999", "#666699", "#FF6600", "#8F4586"];
var stations = [];
var startId=0;
var newRouteIndex=0;
var btn_2 = document.getElementById("initMap");
btn_2.onclick = function(){
    /*console.log(IP+"addPoints");
     $.ajax({
     url: IP+"addPoints",
     type: 'post',
     dataType: "json",
     data: {
     points:BMPA2PA(markerArr)
     },
     success: function(points){
     clearOverlays(1);
     clearOverlays(2);
     var array = parseMarker(points);
     stationArr.push(array);
     var markers=[];
     for(var i=0;i<stationArr.length;i++){
     var pos = stationArr[i].pos.lng+"|"+stationArr[i].pos.lat;
     var marker = {title:"站点_"+stationArr[i].id,content:"自动生成",point:pos,isOpen:0,icon:{w:32,h:40,l:0,t:0,x:6,lb:5},id:stationArr[i].id,type:1};
     markers.push(marker);
     }
     addMarker(markers);
     }
     });*/
    $.gritter.add({
        title: '正在加载',
        text:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请稍等，正在加载地图...',
        class_name: 'gritter-light',
        sticky: false,
        time:''
    });
    map.clearOverlays();
    routes = [];
    stations = [];
    startId=0;
    newRouteIndex=0;
    stationArr=[];
    stationCount = 1;
    routeCount=0;

    getData();
    refreshMap(true);
    var gridster = $(".gridster ul").gridster().data('gridster');//获取对象
    if(gridster){
        gridster.remove_all_widgets(null);
        for (var i = 0; i < routes.length; i++) {
            var col = i + 1;
            for (var j = 0; j < routes[i].stations.length; j++) {
                var row = j + 1;
                stations.push(routes[i].stations[j]);
                var html = "<li id='"+routes[i].stations[j].id+"'data-row='" + row + "' data-col='" + col + "' data-sizex='1' data-sizey='1' style='background:" + COLOR[i % COLOR.length] + " '> " + "<span style='display: none' class='id'>" + routes[i].stations[j].id + "</span>" + routes[i].stations[j].name + "</li>";
                gridster.add_widget(html,1,1,col,row);
            }
        }
    }
};

initMap();//创建和初始化地图
getData();
loadData(routes);

function getData(){
    $.ajax({
        type: 'GET',
        url: 'http://192.168.1.4:3000/users/getRoute',
        //data: {username:$("#username").val(), content:$("#content").val()},
        dataType: 'json',
        async : false,
        success: function (data) {
            routes = data.routes;
            startId=data.next_id;
            newRouteIndex=routes.length;
        },
        error: function () {
            alert("链接失败");
        }
    });
}
function loadData(routs) {
    refreshMap(true);
    blocks.innerHTML="";
    for (var i = 0; i < routs.length; i++) {
        for (var j = 0; j < routs[i].stations.length; j++) {
            var row = j + 1;
            var col = i + 1;
            stations.push(routs[i].stations[j]);
            blocks.innerHTML += "<li id='"+routs[i].stations[j].id+"'data-row='" + row + "' data-col='" + col + "' data-sizex='1' data-sizey='1' style='background:" + COLOR[i % COLOR.length] + " '> " + "<span style='display: none' class='id'>" + routs[i].stations[j].id + "</span>" + routs[i].stations[j].name + "</li>";
        }
    }
    render();
}
function render() {
    var gridster;
    $(function () {
        gridster = $(".gridster > ul").gridster({
            widget_margins: [15, 10],
            widget_base_dimensions: [75, 25],
            extra_cols: 50,
            min_cols: 6,
            draggable:{
                start:function(event, ui){
                    //怎样找到地图上对应的polyline，并删掉
                },
                stop: function(event, ui){
                    var points=[];
                    var data_row =$(event.target).attr('data-row');
                    var data_col =$(event.target).attr('data-col');

                    var pre_row=(parseInt(data_row)-1).toString();
                    var pre = gridster.get_widget_at(data_col,pre_row);
                    var preId=parseInt(pre.eq(0).attr('id'));
                    if(preId){
                        var preIndex=indexOf(preId,stationArr);
                        if(preIndex>=0){
                            var prePos=stationArr[preIndex].pos;
                            points.push(prePos);
                        }else{
                            console.log("not found pre"+preId);
                        }
                    }

                    var curId=parseInt($(event.target).attr('id'));
                    var curIndex=indexOf(curId,stationArr);
                    if(curIndex>=0){
                        var curPos=stationArr[curIndex].pos;
                        points.push(curPos);
                    }else{
                        console.log("not found cur"+curId);
                    }

                    var next_row=(parseInt(data_row)+1).toString();
                    var next = gridster.get_widget_at(data_col,next_row);
                    var nextId=parseInt(next.eq(0).attr('id'));
                    if(nextId){
                        var nextIndex=indexOf(nextId,stationArr);
                        if(nextIndex>=0) {
                            var nextPos = stationArr[nextIndex].pos;
                            points.push(nextPos);
                        }else{
                            console.log("not found next"+nextId);
                        }
                    }

                    if(points.length>1){
                        createRoute(points);
                    }
                    //怎样控制路线颜色
                }
            }
        }).data('gridster');
    });
}
function saveRoute() {
    var newRoutes = routes;
    var gridster = $(".gridster ul").gridster().data('gridster');//获取对象

    for (var i = 0; i < newRouteIndex; i++) {
        newRoutes[i].stations.length = 0;
    }
    for (var i=newRouteIndex; i<gridster.cols; i++){
        newRoutes[i]={route:null,stations:[]};
    }

    var col = 1;
    $("#blocks li").each(function () {
        var data_row = $(this).attr('data-row') - 1;
        var data_col = $(this).attr('data-col') - 1;

        var currentId = $(this).children('span').text();
        for (var j = 0; j < stations.length; j++) {
            if (currentId == stations[j].id) {
                newRoutes[data_col].stations[data_row] = stations[j];
            }
        }
    });

    var postDatas = new Array();
    for(var i=0;i<newRoutes.length;i++){
        var currentStations = newRoutes[i].stations;
        if(currentStations.length==0){
            continue;
        }
        var routeId = 0;
        if(i<newRouteIndex){
            routeId = newRoutes[i].route.id;
        }else{
            routeId=startId;
            startId++;
        }
        for(var j=0;j<currentStations.length;j++){
            var data = {"station_id":currentStations[j].id,"route_id":routeId,"index":(j+1)};
            postDatas.push(data);
        }
    }
    console.log(postDatas);

    var da = JSON.stringify(postDatas);
    $.ajax({
        type: 'POST',
        url: 'http://192.168.1.4:3000/users/changeRoute',
        data: da,
        contentType: "application/json",
        async : true,
        success: function (data) {
            $.gritter.add({
                title: '保存成功！',
                text:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;路线数据已成功同步到数据库。可点击<b style="color: #cf4749;">生成路线</b>按钮撤销全部更改，重新生成路线',
                class_name: 'gritter-light',
                sticky: false,
                time: ''
            });
        },
        error: function () {
            alert("wrong");
        }
    });
}
function refreshMap(ifRefreshMarker){
    var route = [];
    if(ifRefreshMarker){
        stationArr=[];
    }
    //clearOverlays(2);//删除地图上的所有路线
    for(var i=0;i<routes.length;i++){
        route[i]=[];
        for(var j=0;j<routes[i].stations.length;j++){
            var station = routes[i].stations[j];
            var pos = station.posx + "|" + station.posy;
            var point = {id:station.id,pos:new BMap.Point(station.posx,station.posy),name:station.name};
            route[i].push(point.pos);
            if(ifRefreshMarker){
                var marker = [{title:station.name,content:station.address,point:pos,isOpen:0,icon:{w:32,h:40,l:0,t:0,x:6,lb:5},id:station.id,type:1}];
                stationArr.push(point);
                addMarker(marker);
            }
        }
        createRoute(route[i]);
    }
}
jQuery(document).ready(function () {
    $('#gritter-help').click(function () {
        $.gritter.add({
            title: '操作说明：',
            text: '<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每个方块代表一个车站，按行驶顺序排列，每一列为一条路线。'
                    +'通过<b style="color: #f6ec59;">拖放</b>方块的方式进行路线的增删与修改。</p>'
                    +'<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离开页面前点击<b style="color: #f6ec59;">保存</b>按钮保存修改后的路线。</p>',
            //class_name: 'gritter-light',
            sticky: false,
            time: ''
        });
        return false;
    });
});