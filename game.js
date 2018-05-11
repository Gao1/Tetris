// 俄罗斯方块
// 设置背景铺满屏幕
document.getElementById("wrap").style.height = window.innerHeight + 'px';

var table;
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
// 当前方块
var x = [];
var y = [];
var timer;
function toGame(){
    // 隐藏登录框
	document.getElementById("log").style.display = "none";
	// 显示游戏界面
	document.getElementById("start").style.display = "inline-block";
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
	document.getElementById("start").style.opacity = "0";
	document.getElementById("finish").style.opacity = "0";
	document.getElementById("score").style.opacity = "0";
	document.getElementById("start").onclick = "";
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
	// 消除当前方块背景色
	for (var i = 0; i < 4; i++){
        table.rows[y[i]].cells[x[i]].style.backgroundColor = "#FFF";
	}
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
	document.getElementById("start").style.opacity = "1";
	document.getElementById("start").onclick = startGame;
	document.getElementById("finish").style.opacity = "1";
	document.getElementById("score").style.opacity = "1";
	document.getElementById("score").innerHTML = "SCORE: 0";
}