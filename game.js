// 俄罗斯方块
// 设置背景铺满屏幕
document.getElementById("wrap").style.height = window.innerHeight + 'px';

var st = document.getElementById("start");
var sc = document.getElementById("score");
var table;
var flag = 1;
// 初始化方块的图案
var blocks = [
    // 正方形
    [{x: 4, y: 0},{x: 4, y: 1},{x: 5, y: 0},{x: 5, y: 1}],
    // 长方形
    [{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0}],
    // T形
    [{x: 5, y: 0},{x: 5, y: 1},{x: 5, y: 2},{x: 4, y: 1}],
    // Z形
    [{x: 4, y: 1},{x: 4, y: 2},{x: 5, y: 0},{x: 5, y: 1}],
    // 反Z
    [{x: 4, y: 1},{x: 4, y: 0},{x: 5, y: 2},{x: 5, y: 1}],
    // 7形
    [{x: 4, y: 0},{x: 5, y: 2},{x: 5, y: 0},{x: 5, y: 1}],
    // 反7形
    [{x: 4, y: 1},{x: 4, y: 2},{x: 4, y: 0},{x: 5, y: 0}]
];
// 键盘事件
var keyEvent = {
	"37" : "left()",
    "38" : "up()",
    "39" : "right()",
    "40" : "down()"
}
// 当前方块
var x = [];
var y = [];

// 定时器 控制下落速度
var timer;
function toGame(){
    // 隐藏登录框
	document.getElementById("log").style.display = "none";
	// 显示游戏界面
	st.style.display = "inline-block";
	// 创建游戏背景
    table = document.createElement("table");
    for(var i = 0; i < 16; i++){
    	var row = table.insertRow(i);
    	for(var j = 0; j < 10; j++){
    		var cell = row.insertCell(j);
    		cell.style.width = '30px';
    		cell.style.height = '30px';
    	}
    }
    table.border=1;
    table.style.borderCollapse="collapse";
    table.style.margin = "0 auto";
    document.getElementById("wrap").appendChild(table);
}

function startGame(){
	// 通过透明度隐藏开始按钮 避免回流
	st.style.opacity = "0";
	document.getElementById("finish").style.opacity = "0";
	sc.style.opacity = "0";
	st.onclick = "";
	// 清空背景
	for (var i = 0; i < 16; i++){
		for (var j = 0; j < 10; j++){
			table.rows[i].cells[j].style.backgroundColor = "#FFF";
		}
	}
	go();
}

function go(){
    // 随机初始化一个方块
    var currentBlock
    do{ 
    	currentBlock = blocks[parseInt(Math.random()*7)];
    }while(!isOk(currentBlock));
    for (var i = 0; i < currentBlock.length; i++){
        var cur = currentBlock[i];
        y[i] = cur.y;
        x[i] = cur.x;
        table.rows[y[i]].cells[x[i]].style.backgroundColor = "#9F9";
    }
    flag = 1;
    // 开始下落
    timer = setInterval("fallBlock()",500);
}

// 判断初始化方块是否合法
function isOk(blk){
	 for (var i = 0; i < blk.length; i++){
        var cur = blk[i];
        if(table.rows[cur.y].cells[cur.x].style.backgroundColor == "rgb(0, 255, 0)"){
        	console.log(table.rows[cur.y].cells[cur.x].style.backgroundColor);
        	return false;
        }
    }
    return true;
}

// 方块下落
function fallBlock(){
	// 判断是否到底
	var canFall = true;
	for (var i = 0; i < 4; i++){
		var bg = (y[i] + 1 < 16) ? table.rows[y[i]+1].cells[x[i]].style.backgroundColor : "";
		if (y[i] == 15 || bg == "rgb(0, 255, 0)") {
			canFall = false;
			clearInterval(timer);
			for(var i = 0; i < 4; i++){
				table.rows[y[i]].cells[x[i]].style.backgroundColor = "#0F0";
				x[i] = -1;
				y[i] = -1;
			}
			break;
		}
	}
	// 游戏是否结束
	var gameOver = false;
	for (var i = 0; i < 10; i++ ){
		if (table.rows[0].cells[i].style.backgroundColor == "rgb(0, 255, 0)") {
			gameOver = true;
			clearInterval(timer);
			isOver();
		}
	}
	// 下落
	if (canFall) {
	    // 消除当前方块背景色
	    for (var i = 0; i < 4; i++){
            table.rows[y[i]].cells[x[i]].style.backgroundColor = "#FFF";
	    }
		for (var i = 0; i < 4; i++){
			// 全局变量 x 和 y
			y[i] ++;
			table.rows[y[i]].cells[x[i]].style.backgroundColor = "#9F9";
		}
	}else if(!gameOver){
		// 随机产生下一个图案
		go();
	}
}
function isOver(){
	st.style.opacity = "1";
	st.onclick = startGame;
	document.getElementById("finish").style.opacity = "1";
	sc.style.opacity = "1";
	sc.innerHTML = "SCORE: 0";
	flag = 0;
}

// 设置键盘事件
document.onkeydown = function(e){
	eval(keyEvent[(e? e:event).keyCode]);
};

function up(){
    console.log("上");
}
function down(){
	if (flag) {
		clearInterval(timer);
        timer = setInterval("fallBlock()",50);
	}
}
function right(){
	if (flag) {
		var canRight = true;
	    // 判断是否可以右移
	    for (var i = 0; i < 4; i++){
            var ri = (x[i]+1 < 10)? table.rows[y[i]].cells[x[i]+1].style.backgroundColor : "";
            if (x[i] == 9 || ri == "rgb(0, 255, 0)") {
            	canRight = false;
            }
	    }
	    // 右移
    	if (canRight) {
	        // 消除当前方块背景色
        	for (var i = 0; i < 4; i++){
                table.rows[y[i]].cells[x[i]].style.backgroundColor = "#FFF";
	        }
	        // 右移
	        for (var i = 0; i < 4; i++){
	        	x[i] ++;
	        	table.rows[y[i]].cells[x[i]].style.backgroundColor = "#9F9";
	        }
	    }
	}
}
function left(){
	if (flag) {
        var canLeft = true;
	    // 判断是否可以左移
	    for (var i = 0; i < 4; i++){
            var ri = (x[i]-1 > -1)? table.rows[y[i]].cells[x[i]-1].style.backgroundColor : "";
            if (x[i] == 0 || ri == "rgb(0, 255, 0)") {
            	canLeft = false;
            }
	    }
	    // 左移
	    if (canLeft) {
	        // 消除当前方块背景色
        	for (var i = 0; i < 4; i++){
                table.rows[y[i]].cells[x[i]].style.backgroundColor = "#FFF";
	        }
	        // 左移
	        for (var i = 0; i < 4; i++){
	        	x[i] --;
	        	table.rows[y[i]].cells[x[i]].style.backgroundColor = "#9F9";
	        }
	    }
	}
}