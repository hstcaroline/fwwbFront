/**
 * Created by zouwenyun on 2016/6/30.
 */

var btn_addMarker = document.getElementById("addMarker");
var btn_upload = document.getElementById("upload");
//住址数组
var markerArr = [];
//站点数组
var stationArr =[];
var busArr={};
var IP=ip+"/drivingmanager/";
var COLOR=["#FF9900","#333333","#548C00","##009933","#CC0066","#009999","#666699","#FF6600","#8F4586"];
var ifAddMarker = false;
var stationCount = 1;
//var geoCoder=null;

function checkhHtml5(){
    var style=true;
    if (typeof(Worker) === "undefined"){
        if(navigator.userAgent.indexOf("MSIE 9.0")<=0){
            style=false;
        }
    }
    if(style==true){
        var  mapStyle ={
            features: ["road", "building","water","land"],//隐藏地图上的poi
            style : "light"
        }
        window.map.setMapStyle(mapStyle);
    }
}

//创建和初始化地图函数
function initMap(){
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
    var home=new BMap.Marker(COMPANYADDR);
    var icon=new BMap.Icon("media/image/logo.png", new BMap.Size(86,14));
    home.setIcon(icon);
    home.disableMassClear();
    map.addOverlay(home);
}

//创建地图函数
function createMap(){
    var map = new BMap.Map("dituContent",{enableMapClick:false});//在百度地图容器中创建地图
    map.centerAndZoom(COMPANYADDR,12);//设定地图的中心点和坐标并将地图显示在地图容器中
    window.map = map;//将map变量存储在全局
    checkhHtml5();
    //geoCoder=new BMap.Geocoder();
}

//地图事件设置函数：
function setMapEvent(){
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}
//地图控件添加函数：
function addMapControl(){
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}

//创建marker
function addMarker(Arr){
    for(var i=0;i<Arr.length;i++){
        var json = Arr[i];
        var p0 = json.point.split("|")[0];
        var p1 = json.point.split("|")[1];
        var point = new BMap.Point(p0,p1);
        var iconImg = createIcon(json.icon,json.type);
        var marker = new BMap.Marker(point,{icon:iconImg});

        marker.id=json.id;
        marker.type=json.type;
        marker.routeId=json.route_id;
        
        var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
        marker.setLabel(label);
        map.addOverlay(marker);
        label.setStyle({
            borderColor:"#808080",
            color:"#333",
            cursor:"pointer"
        });

        var iw = (function(){
            var index = i;
            var _iw = createInfoWindow(Arr,i);
            var _marker = marker;
            _marker.addEventListener("click",function(){
                this.openInfoWindow(_iw);
            });
            _iw.addEventListener("open",function(){
                _marker.getLabel().hide();
            });
            _iw.addEventListener("close",function(){
                _marker.getLabel().show();
            });
            if(!!json.isOpen){
                label.hide();
                _marker.openInfoWindow(_iw);
            }
            return _iw;
        })();
        //MarkerRightClickHandler(marker,iw);
    }
    changeHints();
}

function addBus(Arr){
    for(var i=0;i<Arr.length;i++){
        var json = Arr[i];
        var p0 = json.position.x;
        var p1 = json.position.y;
        if(busArr[json.route_id]==null){
            var point = new BMap.Point(p0,p1);
            var iconImg = createIcon({w:60,h:40,l:0,t:0,x:6,lb:5},3);
            var marker = new BMap.Marker(point,{icon:iconImg});
            marker.type=3;
            busArr[json.route_id]=marker;
            map.addOverlay(marker);
            addroute(Arr[i].route_id);
        }
        else{
            var point = new BMap.Point(p0,p1);
            busArr[json.route_id].setPosition(point);
        }
    }
}

function addroute(routeid)
{
    var temp={id:routeid};
    var da = JSON.stringify(temp);
    $.ajax({
        url: ip+'/users/getRouteByid',
        //data: {username:$("#username").val(), content:$("#content").val()},
        type:'post',
        data:da,
        contentType: "application/json",
        dataType: 'json',
        async : false,
        success: function (data) {
            var troute=[];
            troute.push(COMPANYADDR);
            for(var j=0;j<data.stations.length;j++){
                var station = data.stations[j];
                var pos = station.posx + "|" + station.posy;
                var point = {id:station.id,pos:new BMap.Point(station.posx,station.posy),name:station.name,address:station.address,num:station.num,time:station.time};
                troute.push(point.pos);
                var marker = [{title:station.name,content:station.address,point:pos,isOpen:0,icon:{w:(map.getZoom()-8)*5,h:(map.getZoom()-8)*5,l:0,t:0,x:6,lb:5},id:station.id,type:1,route_id:data.route.id}];
                stationArr.push(point);
                addMarker(marker);
            }
            createRoute(troute,data.route.id);
        },
        error: function () {
            alert("链接失败");
        }
    });
}

function removeBus(id){
    if(busArr[id]==null){
        return "wrong id";
    }
    else{
        map.removeOverlay(busArr[id]);
        var allOverlay = map.getOverlays();    
        for(var i=0;i<allOverlay.length;i++){
            if(allOverlay[i].routeId==id){
                map.removeOverlay(allOverlay[i]);
            }
        }
    }
}

//创建InfoWindow
function createInfoWindow(Arr,i){
    var json = Arr[i];
    var iw = new BMap.InfoWindow();//("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
    iw.setTitle(json.title);
    iw.setContent(json.content);
    return iw;
}
//创建一个Icon
function createIcon(json,type){
    var icon = null;
    if(type==0){
        icon = new BMap.Icon("media/image/map/star.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
    }else if(type==3){
        icon = new BMap.Icon("media/image/map/bus.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
    }else{
        icon = new BMap.Icon("media/image/map/station.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
    }return icon;
}

//向地图中添加线函数
function addPolyline(plPoints){
    for(var i=0;i<plPoints.length;i++){
        var json = plPoints[i];
        var points = [];
        for(var j=0;j<json.points.length;j++){
            var p1 = json.points[j].split("|")[0];
            var p2 = json.points[j].split("|")[1];
            points.push(new BMap.Point(p1,p2));
        }
        var line = new BMap.Polyline(points,{strokeStyle:json.style,strokeWeight:json.weight,strokeColor:json.color,strokeOpacity:json.opacity});
        map.addOverlay(line);
    }
}

function createRoute(markers,routeID) {//markers是一个Point数组
    var routeId=parseInt(routeID);
    var driving = new BMap.DrivingRoute(map, {
        renderOptions: {//绘制结果
            map: map,
            autoViewport: true,
            enableDragging: true
        },
        onSearchComplete: function(results){
            console.log(1);
            if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                var color = COLOR[(routeId%COLOR.length)];
                var plan = driving.getResults().getPlan(0);
                var num = plan.getNumRoutes();
                for(var i=0;i<num;i++){
                    var pts = plan.getRoute(i).getPath();   //通过驾车实例，获得一系列点的数组
                    var polyline = new BMap.Polyline(pts,{strokeColor: color, strokeWeight: 6, strokeOpacity: 0.9});
                    polyline.type=2;
                    polyline.routeId=routeId;
                    map.addOverlay(polyline);
                    //PolylineRightClickHandler(polyline);
                }
                driving.clearResults();
            }
        }
    });
    driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
    var  group = Math.floor( markers.length /11 ) ;
    var mode = markers.length %11 ;
    for(var i =0;i<group;i++){
        var waypoints = markers.slice(i*11+1,(i+1)*11);
        driving.search(markers[i*11], markers[(i+1)*11],{waypoints:waypoints});//waypoints表示途经点
    }
    if( mode != 0){
        var waypoints = markers.slice(group*11,markers.length-1);//多出的一段单独进行search
        driving.search(markers[group*11],markers[markers.length-1],{waypoints:waypoints});
    }
}

//右键单击marker出现右键菜单事件
var ok_1 = document.getElementById("portlet-remove-ok");
var ok_2 = document.getElementById("portlet-update-ok");
var txt_title = document.getElementById("title");
var txt_content = document.getElementById("content");


function indexOf(marker,Arr) {
    for(var i=0;i<Arr.length;i++){
        if( marker==Arr[i].id || marker.id == Arr[i].id)
            return i;
    }
    return -1;
}

//点的转换 PA:PointsArray[{x,y}]
//BMPA:BaiduMapPointsArray [{id,BMap.Point:{lng,lat}}]
function PA2BMPA(points,ifNew){
    var pointsArr = [];
    if(ifNew){
        for(var i=0;i<points.length;i++){
            pointsArr[i] = [stationCount,new BMap.Point(points[i].x,points[i].y)];
            stationCount++;
        }
    }else{
        for(var i=0;i<points.length;i++){
            pointsArr[i] = [i,new BMap.Point(points[i].x,points[i].y)];
        }
    }
    return pointsArr;
}
function BMPA2PA(points){
    pointsArr = [];
    for(var i=0;i<points.length;i++){
        pointsArr[i] = {"x": points[i][1].lng,
                            "y":points[i][1].lat};
    }
    return pointsArr;
}

//清理某类覆盖物
function clearOverlays(type) {
    var allOverlay = map.getOverlays();
    //console.log("overlay:"+allOverlay.length);
    for(var i=0;i<allOverlay.length;i++){
        //console.log(i+":"+allOverlay[i].type);
        if(allOverlay[i].type==type){
            map.removeOverlay(allOverlay[i]);
        }
    }
}

//搜索功能：站点查询
$(document).ready(function () {
    //Sample 2
    $('#stations_select2').select2({
        placeholder: "站点名称...",
        allowClear: true
    });
    $('#stations_select2').change(function(){
        var id=stationArr[parseInt($("#stations_select2").get(0).selectedIndex)-1].id;
        setPlace(id);
    });
});
function setPlace(id){
    //找到所有站点，比较名字
    for(var i=0;i<stationArr.length;i++){
        if(stationArr[i].id==id){//if(names[i].name==name){
            //var pos=new BMap.Point(names[i].pos.lng,names[i].pos.lat);
            map.centerAndZoom(stationArr[i].pos, 18);
        }
    }
}
function changeHints() {
    $('#stations_select2').empty();
    $('#stations_select2').append('<option value=""></option>');
    for(var i=0;i<stationArr.length;i++){
        $('#stations_select2').append('<option><span style="font-size: 20px">'+stationArr[i].name+'</span><span  style="font-size: 10px">'+stationArr[i].pos.lat+'\'N,'+stationArr[i].pos.lng+'\'E'+'</span></option>');
    }
}

function parseStationArr(points) {
    var pointsArr = [];
    for(var i=0;i<points.length;i++){
        pointsArr[i].pos = new BMap.Point(points[i].x,points[i].y);
        pointsArr[i].id = points[i].id;
        pointsArr[i].name = points[i].name;
        pointsArr[i].address = points[i].address;
        pointsArr[i].num = points[i].num;
    }
    return pointsArr;
}
function parseSimplePointArr(points) {
    pointsArr = [];
    for(var i=0;i<points.length;i++){
        pointsArr[i] = {"x": points[i].pos.lng, 
            "y":points[i].pos.lat,
        "name":points[i].name,
        "id":points[i].id,
        "address":points[i].address,
        "num":points[i].num};
    }
    return pointsArr;
}

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
var COMPANYADDR = new BMap.Point(121.438328,31.023632);
var routes = [];
var UNSAVEDCOLOR = "#333333";
var COLOR = ["#537082", "#FF9900", "#548C00", "##009933", "#CC0066", "#009999", "#666699", "#FF6600", "#8F4586"];
var startId=0;
var newRouteIndex=0;
var gridster = null;
var reloadMap = document.getElementById("reloadMap");

var resetStations = document.getElementById("resetStations");

var selectroutetime=document.getElementById("selectroutetime");

initMap();//创建和初始化地图
//getData();
//loadData(routes);

map.addEventListener('zoomend', function(type,target){
    var overlays=map.getOverlays();
    var zoom=map.getZoom();
    for(var i=0;i<overlays.length;i++){
        if(overlays[i].type==1){
            var icon=createIcon({w:(zoom-8)*5,h:(zoom-8)*5,l:0,t:0,x:6,lb:5},1);
            overlays[i].setIcon(icon);
        }
    }
    console.log(map.getZoom());
});
// 获取鼠标相对div的left值
function getOppositeCoor(id, event){
    event = event || window.event;
    var obj  = document.getElementById(id);
    var left = obj.offsetLeft;
    var parObj = obj;
    while(parObj = parObj.offsetParent){
        left += parObj.offsetLeft;
    }
    var OppositeCoorLeft = event.clientX-left+document.body.scrollLeft;
    return {'left':OppositeCoorLeft};
}
function getData(){
    var temp={};
    temp.time=5;
    console.log(temp);
    var da = JSON.stringify(temp);
    $.ajax({
        url: ip+'/users/getRoute',
        //data: {username:$("#username").val(), content:$("#content").val()},
        type:'get',
        //data:da,
        contentType: "application/json",
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
    //render();
}
function refreshMap(ifRefreshMarker){
    var route = [];
    if(ifRefreshMarker){
        map.clearOverlays();
        stationArr=[];
    }else{
        //clearOverlays(2);//删除地图上的所有路线
    }
    for(var i=0;i<routes.length;i++){
        route[i]=[];
        route[i].push(COMPANYADDR);
        for(var j=0;j<routes[i].stations.length;j++){
            var station = routes[i].stations[j];
            var pos = station.posx + "|" + station.posy;
            var point = {id:station.id,pos:new BMap.Point(station.posx,station.posy),name:station.name,address:station.address,num:station.num,time:station.time};
            route[i].push(point.pos);
            if(ifRefreshMarker){
                var marker = [{title:station.name,content:station.address,point:pos,isOpen:0,icon:{w:(map.getZoom()-8)*5,h:(map.getZoom()-8)*5,l:0,t:0,x:6,lb:5},id:station.id,type:1}];
                stationArr.push(point);
                addMarker(marker);
            }
        }
        createRoute(route[i],routes[i].route.id);
    }
}
function cleanRoute(routeId) {
    var allOverlay = map.getOverlays();
    console.log(routeId);
    for(var i=0;i<allOverlay.length;i++){
        console.log(routeId);
        if(allOverlay[i].type==2){
            console.log(allOverlay[i].routeId);
            if(allOverlay[i].routeId==routeId)
            {
                map.removeOverlay(allOverlay[i]);
            }
        }
    }
}
jQuery(document).ready(function () {
    $('#gritter-help').click(function () {
        $.gritter.add({
            title: '操作说明：',
            text: '<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每个方块代表一个车站，按行驶顺序排列，每一列为一条路线。'
                    +'通过<b style="color: #f6ec59;">拖放</b>方块的方式进行路线的增删与修改。</p>'
                    +'<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击<b style="color: #f6ec59;">生成路线</b>，将根据所有站点生成最佳路线。生成结果<b style="color: #f6ec59;">不会</b>自动保存。</p>'
                    +'<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击<b style="color: #f6ec59;">重置地图</b>，将撤销所有更改，恢复上一次保存结果。</p>'
                    +'<p style="font-family: 微软雅黑">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离开页面前点击<b style="color: #f6ec59;">保存</b>按钮保存所有最新的站点及路线。第一列为未加入路线规划的站点，<b style="color: #f6ec59;">默认舍弃</b>。</p>',
            sticky: true//,
            //time: ''
        });
        return false;
    });
});
