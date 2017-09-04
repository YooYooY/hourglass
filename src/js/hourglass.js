/*
*
*   Hourglass
*
*     author: chenwl
*     
*     最小高度 358
*     最大高度 640
*     推荐宽高 默认
*
*/

;(function(){
  
  var timer=null;

  function Hourglass(elem,opts){
      if(!elem){
        console.warn("参数错误！！！");
        return;
      };
      this.info={
        style:null,
        elem:null
      };
      this.opts=opts || {};
      var elem=this.elem=elem;
      
      // 准备线条
      var createLine=(function(){
          var leftLine=$("<div>").addClass("line-left");
          var centerLine=$("<div>").addClass("line-center");
          var rightLine=$("<div>").addClass("line-right");

          $(elem).append(leftLine)
          $(elem).append(centerLine)
          $(elem).append(rightLine);
      })();


      this.load();
  };

  Hourglass.prototype.load=function(){
    var elem=$(this.elem);
    this.initParam();
    this.initSecen();

    // 是否滴水
    if(this.opts.allowDrip){
        this.openDrip();
      };

    elem.css(this.info.style);
    elem.addClass("hourglass-box");
  }
  
  // 初始化参数
  Hourglass.prototype.initParam = function () {
      var opts=this.opts;

      if(opts.height>=640){
        opts.height=640;
      }else if(opts.height<=358){
        opts.height=358;
      };

      this.info.style={
         width:opts.width || 300,
         height:opts.height || 500,
         color:opts.color || "rgb(44, 127, 190)"
      };

  };
   
  // 初始化场景 
  Hourglass.prototype.initSecen=function(){
      var gwTop=this.glassWaterTop();
      var gwBottom=this.glassWaterBottom();

      $(this.elem).append(gwTop);
      $(this.elem).append(gwBottom);
      
      // 这里判断是否滴水
      if(this.opts.allowDrip){
        var gPipe=this.glassPipe();
        $(this.elem).append(gPipe);
      };

      // 是否没有水波
      if(this.opts.stopWave){
         $(this.elem).find(".wave").css({
          "animation-iteration-count":0,
          "-webkit-animation-iteration-count":0
         });
      }
  };

  Hourglass.prototype.quitWave=function(){
     $(this.elem).find(".wave").css({
      "animation-iteration-count":0,
      "-webkit-animation-iteration-count":0
     });
     clearInterval(timer);
     $(this.pipeWater).fadeOut();
  };
  
  Hourglass.prototype.openDrip = function() {
    var topWaves=this.topWaves,
        bottomWaves=this.bottomWaves,
        pipeWater=this.pipeWater,
        speed=this.opts.dripSpeed || 1000,
        waterTop=Math.abs(this.opts.waterTop),
        waterBottom=Math.abs(this.opts.waterBottom);

      if(this.info.water){
        var waterInfo=this.info.water;
        waterTop=waterInfo.top,
        waterBottom=waterInfo.bottom;        
      }
    
    if(waterBottom>=100){
      waterTop=0;
      waterBottom=100;
    } 

    if(waterTop>=100){
      waterTop=100;
      waterBottom=0;
    };
    
    var quitWave=this.quitWave.bind(this);
    var that=this;
    timer=setInterval(function(){
          
          if(waterTop<=0 || waterBottom>=100){
            clearInterval(timer);
            $(pipeWater).fadeOut();
            quitWave();
            return;
          }else{
            waterTop--;
            waterBottom++;            
          }

            topWaves.css("transform","scale(1,"+(waterTop/100)+")");
             bottomWaves.css("transform","scale(1,"+(waterBottom/100)+")");

                 that.info.water={
                    top:waterTop,
                    bottom:waterBottom
                  }
    },speed);
    
  };

  Hourglass.prototype.getWater=function(){
    return this.info.water;
  }

  Hourglass.prototype.glassWaterTop = function () {

    var opts=this.opts;
    var info=this.info;
    var elem=this.info.elem={};

    var waterColor=info.style.color;
    var waterDepth=opts.waterTop || 0;
    var waveSpeed=opts.waveSpeed || 1000;
     
    var glassTop=$("<div>").addClass("hourglass-top");

    var waves=this.topWaves=initWater(waterDepth,waveSpeed,waterColor);

      glassTop.append(waves);

      return glassTop;
  };

  Hourglass.prototype.glassWaterBottom = function () {
    var opts=this.opts;
    var info=this.info;
    var elem=this.info.elem={};

    var waterColor=info.style.color;
    var waterDepth=opts.waterBottom || 10;
    var waveSpeed=opts.waveSpeed || 1000;

    var glassBottom=$("<div>").addClass("hourglass-bottom");

    var waves=this.bottomWaves=initWater(waterDepth,waveSpeed,waterColor)
    
     glassBottom.append(waves);

      return glassBottom;
  };

  Hourglass.prototype.glassPipe=function(){
    var dripContent=this.pipeWater=$("<div>").addClass('drip-content');
    var dripBox=$("<div>").addClass('drip-box');
    var color=this.info.style.color;
    var height=this.info.style.height;
    var dripSpeed=this.opts.dripSpeed || 1000;
    
    var dripSvg=createDrip(color,dripSpeed);

    dripContent.css("height",height/2+height/6);

     dripBox.append(dripSvg);
     dripContent.append(dripBox);
    return dripContent;
  }

  window.Hourglass=Hourglass;


  function createDrip(color,dripSpeed){

     var speed=dripSpeed;
      
      // 防止下落过快
      if(speed<=200){
        speed=200;
      }
     var _svg="<svg height='100%' width='100%' xmlns='http://www.w3.org/2000/svg'>";
         _svg+="<defs>";
         _svg+="<filter id='goo'>";
         _svg+="<feGaussianBlur stdDeviation='7' />";
         _svg+="<feColorMatrix  mode='matrix' ";
         _svg+="values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7' result='goo' />";
         _svg+="<feBlend in='SourceGraphic' />"
         _svg+="</filter>";
         _svg+="</defs>";
         _svg+="<path class='drop' d='M50,25 C0,100 100,100 50,25' style='animation-duration:"+(speed/1000)+"s'/>";
         _svg+="<line x1='0%' y1='0%' x2='100%' y2='0%' style='stroke:"+color+"; stroke-width:20' />";
         _svg+="</svg>";
            
       return _svg;     
  }
  
  // 准备水
  function initWater(waterDepth,waveSpeed,waterColor){
         
          var waves=$("<div>").addClass("waves");
          var waveBack=$("<div>").addClass("wave wave--back");
          var waveFront=$("<div>").addClass("wave wave--front");
           
          waterDepth=waterDepth>=100?100:waterDepth;
          // 设置水深
          waves.css("transform","scale(1,"+(waterDepth/100)+")");

          // 设置水色和水浪速度
          var waveOpts={
          "color":waterColor,
          "animation-duration":"1s",
          "-webkit-animation-duration":waveSpeed/1000+"s",
          }
          waveBack.css("opacity",".5");//后面水淡一点
          waveBack.css(waveOpts);
          waveFront.css(waveOpts);

          // 开始注水
          for(var i=0;i<2;i++){
          var water=createWater();
          waveFront.append(water);
          }
          for(var i=0;i<2;i++){
          var water=createWater();
          waveBack.append(water);
          }


          waves.append(waveBack);
          waves.append(waveFront);

          return waves;
      }

  // 创建水
  function createWater(){
    var water=$("<div>").addClass("water");
    var waveSvg=createWave();
    water.html(waveSvg);
    return water;
  }

  // 水浪波纹svg
  function createWave(){

    var _svg="<svg viewBox='0 0 350 32' xmlns='http://www.w3.org/2000/svg'>";
        _svg+="<path d='M350,17.32V32H0V17.32C116.56,65.94,175-39.51,350,17.32Z'/>";
        _svg+="</svg>";

     return _svg;
  };


})();
