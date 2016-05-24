// 修复只引用jquery时 按钮无acitve效果
document.body.addEventListener('touchstart', function () {}); 
// 抽奖plugin
;(function($) {
var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
jQuery.fn.extend({
    rotate:function(parameters)
    {
        if (this.length===0||typeof parameters=="undefined") return;
            if (typeof parameters=="number") parameters={angle:parameters};
        var returned=[];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);  
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var paramClone = $.extend(true, {}, parameters); 
                    var newRotObject = new Wilq32.PhotoEffect(element,paramClone)._rootObj;

                    returned.push($(newRotObject));
                }
                else {
                    element.Wilq32.PhotoEffect._handleRotation(parameters);
                }
            }
            return returned;
    },
    getRotateAngle: function(){
        var ret = [];
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);  
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    ret[i] = element.Wilq32.PhotoEffect._angle;
                }
            }
            return ret;
    },
    stopRotate: function(){
        for (var i=0,i0=this.length;i<i0;i++)
            {
                var element=this.get(i);  
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
    }
});
Wilq32=window.Wilq32||{};
Wilq32.PhotoEffect=(function(){

  if (supportedCSS) {
    return function(img,parameters){
      img.Wilq32 = {
        PhotoEffect: this
      };
            
            this._img = this._rootObj = this._eventObj = img;
            this._handleRotation(parameters);
    }
  } else {
    return function(img,parameters) {
            this._img = img;

      this._rootObj=document.createElement('span');
      this._rootObj.style.display="inline-block";
      this._rootObj.Wilq32 = 
        {
          PhotoEffect: this
        };
      img.parentNode.insertBefore(this._rootObj,img);
      
      if (img.complete) {
        this._Loader(parameters);
      } else {
        var self=this;
        jQuery(this._img).bind("load", function()
        {
          self._Loader(parameters);
        });
      }
    }
  }
})();

Wilq32.PhotoEffect.prototype={
    _setupParameters : function (parameters){
    this._parameters = this._parameters || {};
        if (typeof this._angle !== "number") this._angle = 0 ;
        if (typeof parameters.angle==="number") this._angle = parameters.angle;
        this._parameters.animateTo = (typeof parameters.animateTo==="number") ? (parameters.animateTo) : (this._angle); 

        this._parameters.step = parameters.step || this._parameters.step || null;
    this._parameters.easing = parameters.easing || this._parameters.easing || function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }
    this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
        this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
        if (parameters.bind && parameters.bind != this._parameters.bind) this._BindEvents(parameters.bind); 
  },
  _handleRotation : function(parameters){
          this._setupParameters(parameters);
          if (this._angle==this._parameters.animateTo) {
              this._rotate(this._angle);
          }
          else { 
              this._animateStart();          
          }
  },

  _BindEvents:function(events){
    if (events && this._eventObj) 
    {
            if (this._parameters.bind){
                var oldEvents = this._parameters.bind;
                for (var a in oldEvents) if (oldEvents.hasOwnProperty(a)) 
                        jQuery(this._eventObj).unbind(a,oldEvents[a]);
            }

            this._parameters.bind = events;
      for (var a in events) if (events.hasOwnProperty(a)) 
          jQuery(this._eventObj).bind(a,events[a]);
    }
  },

  _Loader:(function()
  {
    return function (parameters)
    {
      this._rootObj.setAttribute('id',this._img.getAttribute('id'));
      this._rootObj.className=this._img.className;
      
      this._width=this._img.width;
      this._height=this._img.height;
      this._widthHalf=this._width/2; 
      this._heightHalf=this._height/2;
      
      var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

      this._widthAdd = _widthMax - this._width;
      this._heightAdd = _widthMax - this._height;
      this._widthAddHalf=this._widthAdd/2; 
      this._heightAddHalf=this._heightAdd/2;
      
      this._img.parentNode.removeChild(this._img);  
      
      this._aspectW = ((parseInt(this._img.style.width,10)) || this._width)/this._img.width;
      this._aspectH = ((parseInt(this._img.style.height,10)) || this._height)/this._img.height;
      
      this._canvas=document.createElement('canvas');
      this._canvas.setAttribute('width',this._width);
      this._canvas.style.position="relative";
      this._canvas.style.left = -this._widthAddHalf + "px";
      this._canvas.style.top = -this._heightAddHalf + "px";
      this._canvas.Wilq32 = this._rootObj.Wilq32;
      
      this._rootObj.appendChild(this._canvas);
      this._rootObj.style.width=this._width+"px";
      this._rootObj.style.height=this._height+"px";
            this._eventObj = this._canvas;
      
      this._cnv=this._canvas.getContext('2d');
            this._handleRotation(parameters);
    }
  })(),

  _animateStart:function()
  { 
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._animateStartTime = +new Date;
    this._animateStartAngle = this._angle;
    this._animate();
  },
    _animate:function()
    {
         var actualTime = +new Date;
         var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

         if (checkEnd && !this._parameters.animatedGif) 
         {
             clearTimeout(this._timer);
         }
         else 
         {
             if (this._canvas||this._vimage||this._img) {
                 var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
                 this._rotate((~~(angle*10))/10);
             }
             if (this._parameters.step) {
                this._parameters.step(this._angle);
             }
             var self = this;
             this._timer = setTimeout(function()
                     {
                     self._animate.call(self);
                     }, 10);
         }

         if (this._parameters.callback && checkEnd){
             this._angle = this._parameters.animateTo;
             this._rotate(this._angle);
             this._parameters.callback.call(this._rootObj);
         }
     },

  _rotate : (function()
  {
    var rad = Math.PI/180;
    if (supportedCSS)
    return function(angle){
            this._angle = angle;
      this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";
    }
    else 
    return function(angle)
    {
            this._angle = angle;
      angle=(angle%360)* rad;
      // clear canvas 
      this._canvas.width = this._width+this._widthAdd;
      this._canvas.height = this._height+this._heightAdd;
            
      this._cnv.translate(this._widthAddHalf,this._heightAddHalf);  
      this._cnv.translate(this._widthHalf,this._heightHalf);   
      this._cnv.rotate(angle); 
      this._cnv.translate(-this._widthHalf,-this._heightHalf);
      this._cnv.scale(this._aspectW,this._aspectH); 
      this._cnv.drawImage(this._img, 0, 0);
    }

  })()
}
})(jQuery);
// 抽奖plugin end

var $lotterBtn = $('.lottery-btn'),
bRotate = false;
//抽奖plugin 方法调用
  var rotateFn = function (awards, angles, shortdec, prizeUrl, compdec,prizeImg){
    bRotate = !bRotate;
    $('#lottery-rotate').stopRotate();
    $('#lottery-rotate').rotate({
      angle:0,
      animateTo:angles+1440,
      duration:4000,
      callback:function (){
        // 中奖弹窗
        $.dialog('.lottery-award-dialog', {
                isBtn: false
              });
        $("#lottery_def_img").attr('src', prizeImg);
        $("#lottery_award_content").html(compdec);
        $(".ui-btn-active").attr('href',prizeUrl).html(btnText);
        //如果中奖要站内跳转则解除绑定
        if(goLink==0){
          $(".ui-btn-active").unbind();
        }
        bRotate = !bRotate;
      }
    })
  };
  // 抽奖btn event 响应
  $lotterBtn.click(function (){
    // 中奖信息提取
    var timeC = $("#timeC"); 

    if(timeC.text()<1&&!bRotate){
      // 抽奖次数用完后
      $.dialog('.lottery-award-dialog', {
                isBtn: false
              });
       $("#lottery_def_img").attr('src', 'images/event-03-11/lottery-fail.png');
        $("#lottery_award_content").html('您今天的抽奖机会已用完。分享该活动页面给好友或单笔存钱金额>=1000元，即可获得抽奖机会1次。');
        $(".ui-btn-active").attr('href','javascript:void(0);').html("知道了");
      return ;
    }
    
    if(bRotate)return;
    else {
      $.ajax({
         // type: "POST",
         // url: "/luckyDraw/getPrize.jhtml?t="+Math.random(),
         type:"GET",
         url:"event-03-11.json?t="+Math.random(),
         async: true,
         dataType: "json",
         success: function(data){ 
            var code = data.code;
            if(code == "0") {
               prizeId = data.prizeId; //奖品id
               prizeUrl = data.prizeUrl; //中奖后跳转地址
               prizeDec = data.prizeDec; //中奖描述
               prizeImg = data.prizeImg; //中奖图片
               btnText = data.btnText; //中奖按钮显示的字
               goLink = data.goLink; //中奖后的按钮是否跳转 0为跳转，1则关闭
      switch (prizeId) {
      case 0:
        rotateFn(0, 0, '9元红包', prizeUrl, prizeDec,prizeImg);
        break;
      case 1:
        rotateFn(1, 315, '150-200M随机流量包', prizeUrl, prizeDec,prizeImg);
        break;
      case 2:
        rotateFn(2, 270, '3元红包', prizeUrl, prizeDec,prizeImg);
        break;
      case 3:
        rotateFn(3, 225, '68元红包', prizeUrl, prizeDec,prizeImg);
        break;
      case 4:
        rotateFn(4, 180, '20-100m流量包', prizeUrl, prizeDec,prizeImg);
        break;
      case 5:
        rotateFn(5, 135, '1元红包', prizeUrl, prizeDec,prizeImg);
        break;
      case 6:
        rotateFn(6, 90, '5元红包', prizeUrl, prizeDec,prizeImg);
        break;
      case 7:
        rotateFn(7, 45, '明天再来', prizeUrl, prizeDec,prizeImg);
        break;
    }
            timeC.text(timeC.text()-1);
             
            }else if(code == "-1") {
              alert(data.errMsg);
              return ;
            }else {
              alert("系统繁忙,请稍候再试..")
              return ;
            }       
         }
      });
      
    }
  });
// 中奖用户信息滚动

var speed=30;
var scrollWrap=document.getElementById("award_list_wrap");
var scrollOne=document.getElementById("award_list_origin");
var scrollTwo=document.getElementById("awrad_list_clone");
scrollTwo.innerHTML=scrollOne.innerHTML;

function Marquee(){
  if (scrollTwo.offsetWidth-scrollWrap.scrollLeft<=0) {
    scrollWrap.scrollLeft-=scrollOne.offsetWidth;
  } else {
    scrollWrap.scrollLeft++;
  }
}
// Marquee();
 var MyMar = setInterval(Marquee,speed);




