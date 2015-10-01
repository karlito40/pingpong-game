'use strict';

var Share = Resource.Share
, PIXI = PIXI || {};

(function(exports) {
  var ALTITUDE_PADDING = 10;
  
  var themes = [
    null,       // 0
    null,       // 1000
    0x0bcff9,     // 2000 .. new color
    0x0bcff9,     // 3000
    0x0bf954,     // 4000 .. new color
    0x0bf954,     // 5000
    0x0bf943,     // 6000 .. new color
    0x0bf943,     // 7000
    0xf9910b,     // 8000 .. new Color
    0xf9910b,     // 9000
    0xffffff,         // 10000
  ];
  
  function Scroller() {
    this.renderer = Share.get('renderer');
    this.viewportY = 0;
    this.altitude = 0;
    this.isActive = false;
    
    var texture = Share.get('resources')['bg-cloud'].texture;
    this.bg = new PIXI.extras.TilingSprite(texture, 1192, 800);

    this.width = Share.get('width');
    this.height = Share.get('height');
    
    this.altitudeText = new PIXI.extras.BitmapText(this.altitude + ' m', {font: "30px OogieBoogie"});
    this.altitudeText.position.x = this.width - ALTITUDE_PADDING - this.altitudeText.width;
    this.altitudeText.position.y = ALTITUDE_PADDING;

    this.renderer.stage.addChild(this.bg);
    this.renderer.stage.addChild(this.altitudeText);
    this.steps = {};
    
    
    this.oriThemeColor = 0xFFFFFF;
    this.themeLayer = new PIXI.Graphics();
    this.themeLayer.color = this.oriThemeColor;
    this.themeLayer.beginFill(this.themeLayer.color)
    this.themeLayer.drawRect(0, 0, this.width, this.height);
    this.themeLayer.endFill();
    this.themeLayer.alpha = 0;
    this.bg.addChild(this.themeLayer);
    
    
  }
  
  Scroller.prototype.update = function() {
    this.setViewportY(this.viewportY + SCROLL_SPEED);
    
    this.altitude += SCROLL_SPEED;
    
    if(this.isActive) {
      this.altitudeText.text = this.altitude + ' m';
      this.altitudeText.position.x = this.width - ALTITUDE_PADDING - this.altitudeText.width  
      
      if(this.sepContainer) {
        this.sepContainer.position.y += SCROLL_SPEED;
      }
      
      var currentStep = Math.floor(this.altitude/STEP_ALTITUDE);
    
      
      // Well it's bad sorry
      if(!this.steps[currentStep]) {
        
        this.steps[currentStep] = true;
        this.activeTheme(currentStep);
        if(this.onStepReach) {
          this.onStepReach(currentStep);
        }
        
        if(currentStep > 0) {
          var stage = Share.get('stage');
          var sepTexture = Share.get('resources').sep.texture;
          
          if(this.sepContainer) {
            stage.removeChild(this.sepContainer);
          }
          
          this.sepContainer = new PIXI.Container();
          this.sepContainer.alpha = 0.1;
          
          var sep = new PIXI.extras.TilingSprite(sepTexture, this.width, 9);
          sep.tint = 0x000000;
        
          var stepInd = currentStep * STEP_ALTITUDE;
          var stepText = new PIXI.extras.BitmapText(stepInd + ' m', {
            font: "30px OogieBoogie",
            tint: 0x000000
          });
          stepText.position.set(10, 10);
          
          this.sepContainer.addChild(sep);
          this.sepContainer.addChild(stepText);
          
          stage.addChildAt(this.sepContainer, 1);  
        }
        
      }
      
      
      if(this.onUpdate) {
        this.onUpdate();
      }
    }
    
  }
  
  Scroller.prototype.active = function() {
    this.steps = {};
    this.altitude = 0;
    this.isActive = true;
  }
  
  Scroller.prototype.stop = function() {
    if(this.sepContainer) {
      var stage = Share.get('stage');
      stage.removeChild(this.sepContainer);
      this.sepContainer = null;
    }
    this.isActive = false;
  }
  
  Scroller.prototype.setViewportY = function(viewportY) {
    this.viewportY = viewportY;
    this.bg.tilePosition.y = viewportY;
  }
  
  Scroller.prototype.activeTheme = function(step) {
    if(!STEP_THEME) {
      return;
    }
    var theme = themes[step];
    var self = this;
    
    if(typeof themes[step] == 'undefined' && step > 0) {
      theme = themes[themes.length-1];
    }
    
    if(theme == null || typeof theme == 'undefined') {
      
      if(this.themeLayer.alpha) {
        this.themeLayer.tint = this.oriThemeColor;
        this.themeLayer.color = this.oriThemeColor;
        
        TweenMax.to(this.themeLayer, 0.2, {alpha: 0});  
      }
      
    } else if(this.themeLayer.color != theme) {
      TweenMax.to(this.themeLayer, 1, {alpha: 0.2, colorProps: {color: theme}, onUpdate: function(){
        self.themeLayer.tint = parseInt(Util.Color.rgbToHex(self.themeLayer.color), 16);
      }});
      
    }
    
  }
  
  Scroller.prototype.getAltitude = function() {
    return this.altitude;
  }
  
  exports.Scroller = Scroller;
  
})(window.Game = window.Game || {})
