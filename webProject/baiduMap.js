    var btn_1 = document.getElementById("addMarker");
    var btn_2 = document.getElementById("searchRoute");
    var clickInfo = document.getElementById("clickInfo");
    var dragInfo = document.getElementById("dragInfo");
    var routeInfo = document.getElementById("routeInfo");

    //标注点数组
    var markerArr = [{title:"东湖面馆",content:"第五餐饮大楼",point:"121.447895|31.030189",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}},
        {title:"实验室",content:"软件学院",point:"121.449099|31.029295",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}
		 ];
    var ifAddMarker = false;
    var searchState = 0;
    var markCount = 1;
    var driving =null;
    var startPos = null;
    var endPos = null;
    btn_1.onclick = function(){
            if(ifAddMarker==true){
                ifAddMarker=false;
                btn_1.value = "启用添加标记";
            }else{
                ifAddMarker=true;
                btn_1.value = "禁用添加标记";
            }
    };
    btn_2.onclick = function(){
        if(searchState == 0){
            searchState = 1;
            btn_2.value ="双击标记设置起点";
        }else if(searchState ==2){
            searchState = 3;
            btn_2.value ="双击标记设置终点";
        }else if(searchState==4){
            btn_2.value = "设置起点";
            searchState = 0;
            getRoute(startPos,endPos);
        }
    };

    //创建和初始化地图函数
    function initMap(){
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addMarker(markerArr);//向地图添加marker
        addPolyline(polylinePoints);//向地图添加线
    }
    
    //创建地图函数
    function createMap(){
        var map = new BMap.Map("dituContent");//在百度地图容器中创建地图
        var point = new BMap.Point(121.448892,31.028955);//定义一个中心点坐标
        map.centerAndZoom(point,18);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
        driving = new BMap.DrivingRoute(map, {
            renderOptions: {//绘制结果
                map: map,
                panel: 'panel'
            },
            onSearchComplete: function(results){
                if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                    var plan = results.getPlan(0);
                    routeInfo.innerHTML = "距离： " + plan.getDistance(true) + " (" + plan.getDistance(false) + "米)";
                }
            }
        });
        driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
    }

    //地图事件设置函数：
    function setMapEvent(){
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
        map.addEventListener("click", function(e){
			var pos = e.point.lng + "|" + e.point.lat;
			clickInfo.innerHTML = "点击信息： "+pos;
            if(ifAddMarker==true){//标注点数组
                var marker = [{title:"标记_"+markCount,content:"通过在页面点击添加",point:pos,isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}];
                addMarker(marker);
                markCount++;
            }
		});
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
			var iconImg = createIcon(json.icon);
            var marker = new BMap.Marker(point,{icon:iconImg});
            marker.enableDragging();
            marker.addEventListener('dragend',function(event){
                dragInfo.innerHTML = "拖曳信息 "
                +event.point.lng+"|"+event.point.lat;
            });
            marker.addEventListener('dblclick',function(event){
                if(searchState==1){
                    startPos = event.point;
                    btn_2.value = "设置终点";
                    searchState = 2;
                }
                if(searchState == 3){
                    endPos = event.point;
                    btn_2.value = "搜索路径";
                    searchState = 4;
                }
            });
			var iw = createInfoWindow(Arr,i);
			var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
			marker.setLabel(label);
            map.addOverlay(marker);
            label.setStyle({
                        borderColor:"#808080",
                        color:"#333",
                        cursor:"pointer"
            });
			
			(function(){
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
				label.addEventListener("click",function(){
				    _marker.openInfoWindow(_iw);
			    });
				if(!!json.isOpen){
					label.hide();
					_marker.openInfoWindow(_iw);
				}
			})()
        }
    }
    //创建InfoWindow
    function createInfoWindow(Arr,i){
        var json = Arr[i];
        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
        return iw;
    }
    //创建一个Icon
    function createIcon(json){
        var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
        return icon;
    }
    //标注线数组
    var polylinePoints = [{style:"solid",weight:3,color:"#f00",opacity:0.6,points:["121.447899|31.030185","121.448789|31.029999","121.446552|31.029319","121.447154|31.027957","121.448205|31.028274","121.448205|31.028321","121.449247|31.028731","121.449076|31.029226"]}
		 ];
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
    function getRoute(pointStart,pointEnd) {
        driving.clearResults();
        driving.search(pointStart, pointEnd);
    }

    initMap();//创建和初始化地图
