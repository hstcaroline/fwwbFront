//var blocks = document.getElementById("blocks");
//var routs = [{
//    'id': 'id1',
//    'name': '线路1',
//    'stations': [{
//        'id': 1,
//        'name': '站点1',
//    }, {
//        'id': 2,
//        'name': '站点2',
//    }]
//}
//    , {
//        'id': 2,
//        'name': '线路2',
//        'stations': [{
//            'id': 3,
//            'name': '站点3',
//        }, {
//            'id': 4,
//            'name': '站点4',
//        }]
//    }, {
//        'id': 3,
//        'name': '线路3',
//        'stations': [{
//            'id': 5,
//            'name': '站点5',
//        }, {
//            'id': 6,
//            'name': '站点6',
//        }]
//    }];

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
            console.log(data);
            routes = data.routes;
            startId=data.next_id;
            newRouteIndex=routes.length;
            refreshMap();
        },
        error: function () {
            alert("链接失败");
        }
    });

}

function loadData(routs) {
    for (var i = 0; i < routs.length; i++) {
        for (var j = 0; j < routs[i].stations.length; j++) {
            var row = j + 1;
            var col = i + 1;
            stations.push(routs[i].stations[j]);
            blocks.innerHTML += "<li data-row='" + row + "' data-col='" + col + "' data-sizex='1' data-sizey='1' style='background:" + COLOR[i % COLOR.length] + " '> " + "<span style='display: none' class='id'>" + routs[i].stations[j].id + "</span>" + routs[i].stations[j].name + "</li>";
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
            min_cols: 6
        }).data('gridster');
    });

}
var newRoutes = routes;
function saveRoute() {
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
function refreshMap(){
    console.log("refreshMap()");
    var route = [];
    for(var i=0;i<routes.length;i++){
        route[i]=[];
        for(var j=0;j<routes[i].stations.length;j++){
            var station = routes[i].stations[j];
            var pos = station.posx + "|" + station.posy;
            var marker = [{title:station.name,content:station.address,point:pos,isOpen:0,icon:{w:32,h:40,l:0,t:0,x:6,lb:5},id:station.id,type:1}];
            var point = [station.id,new BMap.Point(station.posx,station.posy)];
            route[i].push(point[1]);
            point.name=station.name;
            stationArr.push(point);
            addMarker(marker);
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