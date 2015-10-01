'use strict';

var PIXI = PIXI || {}
, Share = Resource.Share
, TweenMax = TweenMax || {};

(function(exports){
  
  var rainbow = [
    0xfe0000, // Red
    0xff9c00, // Orange
    0xf5ff00, // Yellow
    0x3cf10e, // Green
    0x01ffe5, // Cyan
    0x0024ff, // Blue
    0xc500ff, // Purple
    0xff009c, // Pink
  ];
  
  var rainbowI = 0;
  
  
  function Particle(x, y, style) {
    var graphic = new PIXI.Graphics();
    
    var color = 0x000000;
    var alpha = 0.2;
    var radius = 20;
    if(style && style.radius) {
      radius = style.radius;
    }
    
    if(style && style.color) {
      color = style.color;
    }
    
    if(style && style.rainbow) {
      if(!rainbow[rainbowI]) {
        rainbowI = 0;
      }
      color = rainbow[rainbowI++];
      alpha = 0.4;
    }
       
    graphic.beginFill(color);
    graphic.drawCircle(x, y, radius);
    graphic.endFill();
    
    this.circle = new PIXI.Sprite(graphic.generateTexture());
    this.circle.alpha = alpha;
    this.circle.anchor.set(0.5, 0.5);
    this.circle.position.set(x, y);
  }
  
  Particle.prototype.fire = function(type) {
    var self = this;
    var stage = Share.get('stage');
    
    stage.addChildAt(this.circle, 3);
    
    if(!type || type == 'static') {
      TweenMax.to(this.circle.scale, 0.5, {x: 0, y: 0, onComplete: function(){
        stage.removeChild(self.circle);
      }});  
    } else if(type == 'drop') {
      var dist = ~~(Math.random()*100)+50;
      
      var tl = new TimelineMax();
      var duration = Math.random()+0.1;
      tl.to(this.circle.position, duration, {
        y: '-=' + dist,
        ease: Power3.easeOut
      }, 'start');
      
      tl.to(this.circle.scale, duration, {x: 0, y: 0}, 'start');
      
      tl.call(function(){
        stage.removeChild(self.circle);
      });
      
      
    }
    
    
  }
  
  exports.Particle = Particle;
  
})(window.Game = window.Game || {});