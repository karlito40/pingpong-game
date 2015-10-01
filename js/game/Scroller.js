'use strict';

var Share = Resource.Share
, PIXI = PIXI || {};

(function(exports) {
  var ALTITUDE_PADDING = 10;
  
  // var colorSteps = [
  //   0x000000,
  //   0xf4ec1b,
  // ];
  
  // var colorStepsI = 0;
  
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
      if(currentStep > 0 && !this.steps[currentStep]) {
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
        
        this.steps[currentStep] = true;
        if(this.onStepReach) {
          this.onStepReach(currentStep);
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
    // colorStepsI = 0;
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
  
  exports.Scroller = Scroller;
  
})(window.Game = window.Game || {})
