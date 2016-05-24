/**
 * @author floyd
 */


var Mouse = function(type){
	this.mouse = null;
	this.num = -1;
	this.hole = -1;
	this.init(type);
}
Mouse.prototype = {
	mousetype: {
		"good": "../images/game-03-17/coin5.png",
		"bad10": "../images/game-03-17/coin10.png",
		"bad20": "../images/game-03-17/coin20.png",
		"bad50": "../images/game-03-17/coin50.png",
		"bad100": "../images/game-03-17/coin100.png",
		"bad200": "../images/game-03-17/coin200.png",
		"goodkill":"../images/game-03-17/coinkill.png",
		"badkill":"../images/game-03-17/coinkill.png"
	},
	init : function(type){
		type = type || 'good';
		var _this = this;
		
		this.mouse = document.createElement("div");
		this.mouse.mousetype = type;
		this.mouse.islive = true;
		this.mouse.style.cssText = 'width:76.5px;height:78px;background:url('+this.mousetype[type]+');left:0;top:90px;\
		position:relative;margin:auto;cursor:pointer;background-size: 100% !important';
		
		// this.mouse.addEventListener('touchstart',function(e){_this.beat(e);})
		this.mouse.onclick = function(e){_this.beat(e);};
	},
	beat : function(e){
		
		if(this.mouse.islive){
			function audioplay() {
			var audioele = document.getElementById('hitsound'); 
			audioele.currentTime = 0;
			audioele.play();
			audioele.volume = 0.1;  
		}  
			this.mouse.islive = false;
			this.onbeat();
			audioplay();
			this.mouse.style.background = "url("+this.mousetype[(this.mouse.mousetype).replace(/[^a-z]/ig,"")+"kill"]+") no-repeat";
		} 
	},
	animation : function(speed){
		
		speed = speed == 'fast'?30:speed == 'normal'?40:60;
		
		var obj = this.mouse,ost = obj.style,oTop = parseInt(ost.top,10),cut=5,_this = this;
		
		var show = function(top){
			
			top = top-cut;
			
			if(top >= 10){
				ost.top = top + 'px';
				setTimeout(function(){show(top);},speed);
			}
			else
			{
				setTimeout(function(){hide(10);},speed*10);
			}
		}
		var hide = function(top){
			
			top = top+cut;
			
			if(top <= oTop){
				ost.top = top + 'px';
				setTimeout(function(){hide(top);},speed);
			}
			else {
				_this.reset();
			}
		}
		show(oTop);
	},
	reset : function(){
		
		this.mouse.islive =true;
		this.mouse.style.background = "url("+this.mousetype[this.mouse.mousetype]+")";
		
		this.onend();
	},
	onbeat : function(){},
	onend : function(){}
}


var Game = {
	time : 16,
	mouseMap : {
		1:'good',
		2:'good',
		3:'good',
		4:'good',
		5:'good',
		6:'good',
		7:'bad50',
		8:'bad100',
		9:'bad20',
		10:'bad100',
		11:'bad10',
		12:'bad20',
		13:'bad50',
		14:'bad100',
		15:'bad200'
	},
	allMouse : [],
	nowScore : 0,
	hasHole : {},
	hasMouse : {},
	lis : null,
	init : function(){

		this.lis = document.getElementById('game_stage').getElementsByTagName('li');
		_this = this;

		for(var i=1;i <=15;i++){
			var mouse = new Mouse(this.mouseMap[i]);
			mouse.onbeat = function(){
				Game.changeScore(this.mouse.mousetype=='good'?5:parseInt((this.mouse.mousetype).replace(/[^0-9]/ig,"")));
			}
			mouse.onend = function(){
				var li = _this.lis[this.hole];
				li.firstChild.removeChild(li.mouse.mouse);
				li.mouse = null;
				
				_this.hasHole[this.hole] = null;
				_this.hasMouse[this.num] = null;
			}
			this.allMouse.push(mouse);
		}
	},
	changeScore : function(score){
		this.nowScore += score;
		document.getElementById('score').innerHTML = this.nowScore;
	},
	start : function(){
		
		if(this.time <= 0)return;
		
		var _this = this;
		
		var random = parseInt(Math.random()*9,10);
		
		while(this.hasHole[random]){
			random = parseInt(Math.random()*9,10);
		}
		// 成本控制
		scoreRandom = parseInt($("#score").text(),10)>=2000?6:15;

		var randomMouse = parseInt(Math.random()*scoreRandom,10);
		
		while(this.hasMouse[randomMouse]){
			randomMouse = parseInt(Math.random()*scoreRandom,10);
		}
		
		this.allMouse[randomMouse].hole = random;
		this.allMouse[randomMouse].num = randomMouse;
		this.lis[random].firstChild.appendChild(this.allMouse[randomMouse].mouse);
		this.lis[random].mouse = this.allMouse[randomMouse];
		this.lis[random].mouse.animation('normal');
		
		this.hasHole[random] = 'true';
		this.hasMouse[randomMouse] = 'true';
		// requestAnimationFrame() 优化动画
		 setTimeout(function(){_this.start();},350);
	},
	startTime : function(){
		
		this.time -= 1;
		var _this = this;
		
		document.getElementById('time').innerHTML = this.time;
		
		if(this.time > 0){
			setTimeout(function(){_this.startTime()},1000);
		}else if(this.time<=0){
			setTimeout(function(){
				$.dialog('.lottery-award-dialog', {
                isBtn: false
              });
				$(".ui-dialog-close").remove();
			// 获得分数 
			var $score = parseInt($("#score").text(),10);

			$("#lottery_award_content").html("\u6e38\u620f\u7ed3\u675f\uff0c\u83b7\u5f97\u91d1\u5e01\uff1a"+$score+"\u5143");

			$(".ui-btn-active").attr('href','https://baidu.com');
			$(".ui-btn-active").unbind();
		},1950)
		}
	},
	reset : function(){
		this.time = 16;
		this.allMouse = [];
		this.nowScore = 0;
		this.hasHole = {};
		this.hasMouse = {};
		this.lis = null;
		
		this.changeScore(0);
	}
}

function GameStart(){
	Game.reset();
	Game.init();
	Game.start();
	Game.startTime();
}
var ScrollFix = function(elem) {
  var startY, startTopScroll;
  elem = elem || document.querySelector(elem);
  if(!elem)
    return;
  elem.addEventListener('touchstart', function(event){
    startY = event.touches[0].pageY;
    startTopScroll = elem.scrollTop; 
    if(startTopScroll <= 0)
      elem.scrollTop = 1;
    if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
      elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
  }, false);
};
var scrollable = document.getElementById("stage");
    new ScrollFix(scrollable);