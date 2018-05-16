// 俄罗斯方块
// 设置背景铺满屏幕
document.getElementById("wrap").style.height = window.innerHeight + 'px';

var st = document.getElementById("start");
var sc = document.getElementById("score");
var gs = document.getElementById("gameScore");
var table;
var score = 0;
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
    [{x: 4, y: 1},{x: 5, y: 1},{x: 4, y: 0},{x: 5, y: 2}],
    // 7形
    [{x: 4, y: 0},{x: 5, y: 0},{x: 5, y: 1},{x: 5, y: 2}],
    // 反7形
    [{x: 5, y: 0},{x: 4, y: 0},{x: 4, y: 1},{x: 4, y: 2}]
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
var tatris;
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
	score = 0;
	gs.innerHTML = "SCORE:" + score;
	// 通过透明度隐藏开始按钮 避免回流
	gs.style.opacity = "1";
	st.style.opacity = "0";
	document.getElementById("finish").style.opacity = "0";
	sc.style.opacity = "0";
	st.onclick = "";
	// 清空背景
	for (var i = 0; i < 16; i++){
		for (var j = 0; j < 10; j++){
			getColor(i,j,"#FFF");
		}
	}
	go();
}

function go(){
    // 随机初始化一个方块
    var currentBlock;
    do{ 
    	tatris = parseInt(Math.random()*7);
    	currentBlock = blocks[tatris];
    }while(!isOk(currentBlock));
    for (var i = 0; i < currentBlock.length; i++){
        var cur = currentBlock[i];
        y[i] = cur.y;
        x[i] = cur.x;
        getColor(y[i],x[i],"#9F9");
    }
    flag = 1;
    // 开始下落
    timer = setInterval("fallBlock()",500);
}

// 判断初始化方块是否合法
function isOk(blk){
	 for (var i = 0; i < blk.length; i++){
        var cur = blk[i];
        if(getColor(cur.y,cur.x) == "rgb(0, 255, 0)"){
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
		var bg = (y[i] + 1 < 16) ? getColor(y[i]+1,x[i]) : "";
		if (y[i] == 15 || bg == "rgb(0, 255, 0)") {
			canFall = false;
			clearInterval(timer);
			for(var i = 0; i < 4; i++){
				getColor(y[i],x[i],"#0F0");
			}
			canRemove();
			break;
		}
	}
	// 游戏是否结束
	var gameOver = false;
	for (var i = 0; i < 10; i++ ){
		if (getColor(0,i) == "rgb(0, 255, 0)") {
			gameOver = true;
			clearInterval(timer);
			isOver();
		}
	}
	// 下落
	if (canFall) {
	    // 消除当前方块背景色
	    for (var i = 0; i < 4; i++){
	    	getColor(y[i],x[i],"#FFF");
	    }
		for (var i = 0; i < 4; i++){
			// 全局变量 x 和 y
			y[i] ++;
			getColor(y[i],x[i],"#9F9");
		}
	}else if(!gameOver){
		// 随机产生下一个图案
		go();
		rorate = 1;
	}
}
function isOver(){
	st.style.opacity = "1";
	gs.style.opacity = "0";
	st.onclick = startGame;
	document.getElementById("finish").style.opacity = "1";
	sc.style.opacity = "1";
	sc.innerHTML = "SCORE: " + score;
	flag = 0;
}

// 设置键盘事件
document.onkeydown = function(e){
	if (flag) {
	    eval(keyEvent[(e? e:event).keyCode]);
	}
};

var rorate = 1;
function up(){
    // 复杂
    switch(tatris){
    	case 1: rect(); break;
    	case 2: t(); break;
    	case 3: 
    	case 4: z(); break;
    	case 5: rorate7();break;
    	case 6: oppo7(); break;
    }
}
function down(){
	clearInterval(timer);
    timer = setInterval("fallBlock()",50);
}
function right(){
	var canRight = true;
	// 判断是否可以右移
	for (var i = 0; i < 4; i++){
        var ri = (x[i]+1 < 10)? getColor(y[i],x[i]+1) : "";
        if (x[i] == 9 || ri == "rgb(0, 255, 0)") {
        	canRight = false;
        }
	}
	// 右移
    if (canRight) {
	    // 消除当前方块背景色
       	for (var i = 0; i < 4; i++){
       		getColor(y[i],x[i],"#FFF");
	    }
	    // 右移
	    for (var i = 0; i < 4; i++){
	    	x[i] ++;
	    	getColor(y[i],x[i],"#9F9");
	    }
	}
}
function left(){
    var canLeft = true;
	// 判断是否可以左移
	for (var i = 0; i < 4; i++){
        var ri = (x[i]-1 > -1)? getColor(y[i],x[i]-1) : "";
        if (x[i] == 0 || ri == "rgb(0, 255, 0)") {
        	canLeft = false;
        }
	}
	// 左移
	if (canLeft) {
	    // 消除当前方块背景色
    	for (var i = 0; i < 4; i++){
    		getColor(y[i],x[i],"#FFF");
	    }
	    // 左移
	    for (var i = 0; i < 4; i++){
	    	x[i] --;
	    	getColor(y[i],x[i],"#9F9");
	    }
	}
}

// 判断是否可以消除
function canRemove(){
	var remove = new Array();
	var repeat;
	// 消除当前行
	for(var i = 0; i < 4; i++){
		remove.push(y[i]);
		for(var j = 0; j < 10; j++){
			if (getColor(y[i],j) != "rgb(0, 255, 0)") {
				remove.pop(y[i]);
				break;
			}
		}
	}
	remove.sort();
	for(var i = 0; i < remove.length; i++){
		if (remove[i] == repeat) {
			continue;
		}
		score += 10;
	    for(var j = 0; j < 10; j++){
	    	getColor(remove[i],j,"#FFF");
	    }
	       // 上方图案下落
	    for(var k = remove[i]; k >= 0; k--){
	    	for(var m = 0; m < 10; m++){
	    		if (getColor(k,m) == "rgb(0, 255, 0)") {
	    			getColor(k,m,"#FFF");
	    			getColor(k+1,m,"#0F0");
	    		}
	    	}
	    }
        repeat = remove[i];
	}
	gs.innerHTML = "SCORE:" + score;
}

// 获取或设置背景色
function getColor(i, j, color){
	if (arguments.length == 3) {
		table.rows[i].cells[j].style.backgroundColor = color;
	}else if(arguments.length == 2){
		return table.rows[i].cells[j].style.backgroundColor;
	}
}

// 长方形旋转
function rect(){
	var canRotate = true;
	if (y[0] == y[1]) {
		var xx = x[2];
	    var yy = y[0]+1;
	    for(var i = 0; i < 2; i++){
	    	if (yy > 15 || getColor(yy,xx) != "rgb(255, 255, 255)") {
	    	    canRotate = false;
	    	    break;
	        }
	        yy++;
	    }
	    yy -= 4;
	    if (yy < 0 || getColor(yy,xx) != "rgb(255, 255, 255)") {
	    	canRotate = false;
	    }
	    if (canRotate) {
	    	// 消除原图案
	    	for(var i = 0; i < 4; i++){
	    		getColor(y[i],x[i],"#FFF");
	    	}
	    	// 显示新图案
	    	x[0]+=2;
	    	y[0]--;
	    	getColor(y[0],x[0],"#9F9");
	    	for(var i = 1; i < 4; i++){
	    		x[i] = xx;
	    		y[i] = y[i-1]+1;
	    		getColor(y[i],x[i],"#9F9");
	        }
	    }
	}else{
		var xx = x[0] - 1;
		var yy = y[1];
		for(var i = 0; i < 2; i++){
	    	if (xx < 0 || getColor(yy,xx) != "rgb(255, 255, 255)") {
	    	    canRotate = false;
	    	    break;
	        }
	        xx--;
	    }
	    xx += 4;
	    if (xx > 9 || getColor(yy,xx) != "rgb(255, 255, 255)") {
	    	canRotate = false;
	    }
	    if (canRotate) {
	    	// 消除原图案
	    	for(var i = 0; i < 4; i++){
	    		getColor(y[i],x[i],"#FFF");
	    	}
	    	// 显示新图案
	    	x[0]-=2;
	    	y[0]++;
	    	getColor(y[0],x[0],"#9F9");
	    	for(var i = 1; i < 4; i++){
	    		x[i] = x[i-1] + 1;
	    		y[i] = yy;
	    		getColor(y[i],x[i],"#9F9");
	        }
	    }
	}
}

// T 形旋转
function t(){
	var canRorate = true;
    if (rorate == 1 || rorate == 3) {
    	var yy = y[2];
    	var xx = x[3];
    	for(var i = 0; i < 2; i++){
    		if (xx < 0 || xx > 9 || getColor(yy,xx) != "rgb(255, 255, 255)") {
    			canRorate = false;
    			break;
    		}
    		if (rorate == 1) {
    		    xx--;
    		}else{
    			xx++;
    		}
    	}
    	if (canRorate) {
    		// 消除原图案
	  	    for(var i = 0; i < 3; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
	  	    y[0] = yy;
	  	    getColor(y[0],x[0],"#9F9");
	  	    for(var j = 1; j < 3; j++){
	  	    	if (rorate == 1) {
	  	    	    x[j] = x[j-1] - 1;
	  	        }else{
	  	        	x[j] = x[j-1] + 1;
	  	        }
	  	    	y[j] = yy;
	  	    	getColor(y[j],x[j],"#9F9");
	  	    }
    	}
    	rorate++;
    }else{
    	var yy = y[3];
    	var xx = x[2];
    	for(var i = 0; i < 2; i++){
    		if (yy < 0 || yy > 15 || getColor(yy,xx) != "rgb(255, 255, 255)") {
    			canRorate = false;
    			break;
    		}
    		if (rorate == 2) {
    			yy--;
    		}else{
    			yy++;
    		}
    	}
    	if (canRorate) {
    		// 消除原图案
	  	    for(var i = 0; i < 3; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
	  	    x[0] = xx;
	  	    getColor(y[0],x[0],"#9F9");
	  	    for(var j = 1; j < 3; j++){
	  	    	if (rorate == 2) {
	  	    		y[j] = y[j-1] - 1;
	  	    	}else{
	  	    		y[j] = y[j-1] + 1;
	  	    	}
	  	    	x[j] = xx;
	  	    	getColor(y[j],x[j],"#9F9");
	  	    }
    	}
    	rorate++;
    	if (rorate == 5) {
    		rorate = 1;
    	}
    }
}

// Z形旋转
function z(){
    var canRorate = true;
    if (rorate == 1) {
    	if (x[3]-2 < 0 || getColor(y[3],x[3]-2) != "rgb(255, 255, 255)") {
    	    canRorate = false;
        }
        if (y[2]+2 > 15 || getColor(y[2]+2,x[2]) != "rgb(255, 255, 255)") {
    	    canRorate = false;
        }
        if (canRorate) {
        	// 消除原图案
	  	    for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
        	x[3] -= 2;
            y[2] += 2;
            for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#9F9");
	  	    }
	  	    rorate = 2;
        }
    }else{
    	if (x[3]+2 > 9 || getColor(y[3],x[3]+2) != "rgb(255, 255, 255)") {
    	    canRorate = false;
        }
        if (y[2]-2 < 0 || getColor(y[2]-2,x[2]) != "rgb(255, 255, 255)") {
    	    canRorate = false;
        }
        if (canRorate) {
        	// 消除原图案
	  	    for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
        	x[3] += 2;
            y[2] -= 2;
            for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#9F9");
	  	    }
	  	    rorate = 1;
        }
    }
}

// 7形旋转
function rorate7(){
	var canRorate = true;
	if (rorate == 1 || rorate == 3) {
		if (rorate == 1) {
			if (y[0]+2 > 15 || getColor(y[0]+2,x[0]) != "rgb(255, 255, 255)") {
		       	canRorate = false;
		    }
		    if (x[3]-2 < 0 || getColor(y[3],x[3]-2) != "rgb(255, 255, 255)") {
		    	canRorate = false;
		    }
		}else{
			if (y[0]-2 < 0 || getColor(y[0]-2,x[0]) != "rgb(255, 255, 255)") {
		       	canRorate = false;
		    }
		    if (x[3]+2 > 9 || getColor(y[3],x[3]+2) != "rgb(255, 255, 255)") {
		    	canRorate = false;
		    }
		}
		if (canRorate) {
			// 消除原图案
	  	    for(var i = 0; i < 2; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
	  	    if (rorate == 1) {
	  	    	y[0] += 2;
	  	        x[1] -= 2;
	  	        y[1] += 2;
	  	    }else{
	  	    	y[0] -= 2;
	  	    	x[1] += 2;
	  	    	y[1] -= 2;
	  	    }
	  	    for(var i = 0; i < 2; i++){
	  	    	getColor(y[i],x[i],"#9F9");
	  	    }
	  	    rorate ++;
		}
	}else{
		if (rorate == 2) {
            if (y[1]-2 < 0 || getColor(y[1]-2,x[1]) != "rgb(255, 255, 255)") {
    		   	canRorate = false;
    		}
    		if (x[2]-2 < 0 || getColor(y[2],x[2]-2) != "rgb(255, 255, 255)") {
    			canRorate = false;
    		}
		}else{
			if (y[1]+2 > 15 || getColor(y[1]+2,x[1]) != "rgb(255, 255, 255)") {
    		   	canRorate = false;
    		}
    		if (x[2]+2 > 9 || getColor(y[2],x[2]+2) != "rgb(255, 255, 255)") {
    			canRorate = false;
    		}
		}
		if (canRorate) {
			// 消除原图案
	  	    for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
	  	    if (rorate == 2){
	  	    	x[2] -= 2;
	  	        y[3] -= 2;
	  	        x[3] -= 2;
	  	        rorate ++;
	  	    }else{
	  	    	x[2] += 2;
	  	    	x[3] += 2;
	  	    	y[3] += 2;
	  	    	rorate = 1;
	  	    }
	  	    for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#9F9");
	  	    }
		}
	}
}

// 反7形旋转
function oppo7(){
	var canRorate = true;
	if (rorate == 1 || rorate == 3) {
		if (rorate == 1) {
			if (x[1]+2 > 9 || getColor(y[1],x[1]+2) != "rgb(255, 255, 255)") {
		       	canRorate = false;
		    }
		    if (x[2]+2 > 9 || getColor(y[2],x[2]+2) != "rgb(255, 255, 255)") {
		    	canRorate = false;
		    }
		}else{
			if (x[1]-2 < 0 || getColor(y[1],x[1]-2) != "rgb(255, 255, 255)") {
		       	canRorate = false;
		    }
		    if (x[2]-2 < 0 || getColor(y[2],x[2]-2) != "rgb(255, 255, 255)") {
		    	canRorate = false;
		    }
		}
		if (canRorate) {
			// 消除原图案
	  	    for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
	  	    if (rorate == 1) {
	  	    	y[3] -= 2;
	  	        x[2] += 2;
	  	        x[3] += 2;
	  	    }else{
	  	    	y[3] += 2;
	  	        x[2] -= 2;
	  	        x[3] -= 2;
	  	    }
	  	    for(var i = 2; i < 4; i++){
	  	    	getColor(y[i],x[i],"#9F9");
	  	    }
	  	    rorate ++;
		}
	}else{
		if (rorate == 2) {
            if (y[3]+2 > 15 || getColor(y[3]+2,x[3]) != "rgb(255, 255, 255)") {
    		   	canRorate = false;
    		}
    		if (y[0]+2 > 15 || getColor(y[0]+2,x[0]) != "rgb(255, 255, 255)") {
    			canRorate = false;
    		}
		}else{
			if (y[3]-2 < 0 || getColor(y[3]-2,x[3]) != "rgb(255, 255, 255)") {
    		   	canRorate = false;
    		}
    		if (y[0]-2 < 0 || getColor(y[0]-2,x[0]) != "rgb(255, 255, 255)") {
    			canRorate = false;
    		}
		}
		if (canRorate) {
			// 消除原图案
	  	    for(var i = 0; i < 2; i++){
	  	    	getColor(y[i],x[i],"#FFF");
	  	    }
	  	    // 显示新图案
	  	    if (rorate == 2){
	  	    	x[1] += 2;
	  	        y[0] += 2;
	  	        y[1] += 2;
	  	        rorate ++;
	  	    }else{
	  	    	x[1] -= 2;
	  	        y[0] -= 2;
	  	        y[1] -= 2;
	  	    	rorate = 1;
	  	    }
	  	    for(var i = 0; i < 2; i++){
	  	    	getColor(y[i],x[i],"#9F9");
	  	    }
		}
	}
}