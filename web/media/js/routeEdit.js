var blocks=document.getElementById("blocks");
var block_data=[3,3,3,3,3,3,3,3,3];
var COLOR=["#FF9900","#333333","#548C00","##009933","#CC0066","#009999","#666699","#FF6600","#8F4586"];
init();
function init() {
    for(var i=0;i<block_data.length;i++){
        for(var j=0;j<block_data[i];j++){
            var row=j+1;
            var col=i+1;
            blocks.innerHTML+="<li data-row='"+row+"' data-col='"+col+"' data-sizex='1' data-sizey='1' style='background:"+COLOR[i%COLOR.length]+" '> 车站名称</li>";
        }
    }
}