'use strict';

var Share = Resource.Share
, Style = Resource.StyleSheet
, Physics = Physics || {};

(function(exports){
  
  
  function PlatformMaker() {
    this.worldManager = Share.get('world_manager');
    this.isDraging = false;
    this.renderer = Share.get('renderer');
    this.world = Share.get('world');
    this.lineMaker = null;
    this.p1 = null;
    this.p2 = null;
    this.onBuild = null;
    this.nbPlatform = 0;
  }
  
  PlatformMaker.prototype.reset = function() {
    this.nbPlatform = 0;
  }
  
  PlatformMaker.prototype.getEvents = function() {
    
    return {
      'interact:poke': this.onPoke.bind(this),
      'interact:move': this.onMove.bind(this),
      'interact:release': this.onRelease.bind(this)
      
    };
  }
  
  PlatformMaker.prototype.onPoke = function(pos) {
    this.isDraging = true;
    this.p1 = pos;
    // this.p1Maker = this.renderer.createCircle(pos.x, pos.y, RADIUS_POINT, Style.circle);
    
    // var circleTexture = Share.get('resources').circle.texture;
    // this.p1Maker = new PIXI.Sprite(circleTexture);
    // this.p1Maker.anchor.set(0.5, 0.5);
    // this.p1Maker.position.x = pos.x;
    // this.p1Maker.position.y = pos.y;
    
    // this.renderer.stage.addChild(this.p1Maker);
  }
  
  PlatformMaker.prototype.onMove = function(pos) {
    
    if(!this.isDraging) {
      return;
    }
    
    this.p2 = pos;
      
    if(this.lineMaker) {
      this.renderer.stage.removeChild(this.lineMaker);
    }
    
    if(this.p1Maker) {
      this.renderer.stage.removeChild(this.p1Maker);
    }
    if(this.p2Maker) {
      this.renderer.stage.removeChild(this.p2Maker);
    }
    
    this.lineMaker = this.renderer.createLine(this.p1, this.p2, Style.line);
    
    // this.p2Maker = this.renderer.createCircle(pos.x, pos.y, RADIUS_POINT, Style.circle);
    var circleTexture = Share.get('resources').circle.texture;
    
    this.p1Maker = new PIXI.Sprite(circleTexture);
    this.p1Maker.anchor.set(0.5, 0.5);
    this.p1Maker.position.x = this.p1.x;
    this.p1Maker.position.y = this.p1.y;
    
    this.p2Maker = new PIXI.Sprite(circleTexture);
    this.p2Maker.anchor.set(0.5, 0.5);
    this.p2Maker.position.x = pos.x;
    this.p2Maker.position.y = pos.y;
    
    this.renderer.stage.addChild(this.lineMaker);
    this.renderer.stage.addChild(this.p1Maker);
    this.renderer.stage.addChild(this.p2Maker);
    
  }
  
  PlatformMaker.prototype.onRelease = function(pos) {
    this.isDraging = false;
    var isAllowed = this.lineMaker;
    if(this.p1Maker) {
      this.renderer.stage.removeChild(this.p1Maker);  
    }
    
    if(this.lineMaker) {
      this.renderer.stage.removeChild(this.lineMaker);
    }
    
    if(this.p2Maker) {
      this.renderer.stage.removeChild(this.p2Maker);
    }
    
    this.p1Maker = null;
    this.p2Maker = null;
    this.lineMaker = null;
    
    if(!isAllowed) {
      return;
    }
    
    var from = { x: this.p1.x, y: this.p1.y };
    var to = { x: this.p2.x, y: this.p2.y };
    
    this.renderer.stage.removeChild(this.p1Maker);
    this.renderer.stage.removeChild(this.lineMaker);
    this.renderer.stage.removeChild(this.p2Maker);
    
    var deltaX = to.x - from.x;
    var deltaY = to.y - from.y;
    var w = Math.abs(deltaX); 
    var h = Math.abs(deltaY);
    
    var width = Math.sqrt( Math.pow(w, 2) + Math.pow(h, 2) );
    var angle = Math.atan2(deltaY, deltaX);
    
    var heightTrampoline = 4;
    
    // Create a trampoline at this place
    var trampoline = Physics.body('rectangle', {
      width: width,
      height: heightTrampoline,
      x: from.x,
      y: from.y,
      vy: (this.nbPlatform) ? PLATFORM_SPEED : 0,
      cof: 1,
      restitution: 1,
      angle: angle,
      treatment: 'kinematic',
      offset: Physics.vector(width/2, 0)
    });
    
    trampoline.className = 'trampoline';
    if(!this.nbPlatform) {
      trampoline.idName = PLATFORM_TUTO;  
    }
    
    var lineTexture = Share.get('resources').line.texture;
    var circleTexture = Share.get('resources').circle.texture;
    
    var lineContainer = new PIXI.Container();
    var tilingSprite = new PIXI.extras.TilingSprite(lineTexture, width, heightTrampoline);
    
    var leftCircle = new PIXI.Sprite(circleTexture);
    var rightCircle = new PIXI.Sprite(circleTexture);
    
    leftCircle.anchor.set(0.5, 0.5);
    rightCircle.anchor.set(0.5, 0.5);
    rightCircle.position.x = width;
    tilingSprite.position.y = -2;
      
    lineContainer.addChild(tilingSprite);
    lineContainer.addChild(leftCircle);
    lineContainer.addChild(rightCircle);
    
    trampoline.view = this.renderer.createDisplay('view', {
      view: lineContainer
    });
    
    this.worldManager.addBody(trampoline);
    
    if(this.onBuild) {
      this.onBuild(trampoline);
    }
    
    this.nbPlatform++;
    
  }
  
  exports.PlatformMaker = PlatformMaker;
  
})(window.Game = window.Game || {});