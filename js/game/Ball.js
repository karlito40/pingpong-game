'use strict';

var Physics = Physics || {}
, Share = Resource.Share
, TimelineMax = TimelineMax || {}
, TweenMax = TweenMax || {};

(function(exports){
  
  function Ball() {
    
    this.renderer = Share.get('renderer');
    
    this.onMove = null;
    this.colorTrail = 0x000000;
    this.body = Physics.body('circle', {
      radius: 25,
      x: this.renderer.width / 2,
      y: 210,
      restitution: 1,
      cof: 1,
      mass: 1000,
      angle: 0,
      treatment: 'static',
    });
    this.idName = 'ball';
    this.body.idName = this.idName;
  
    var ballTexture = Share.get('resources')['youssy-ball'].texture;
    this.body.view = this.renderer.createDisplay('sprite', {
      texture: ballTexture,
      anchor: {
        x: 0.5,
        y: 0.5
      }
    });
    
    
    var worldManager = Share.get('world_manager');
    worldManager.addBody(this.body);
    
    
    this.stop();
    this.trail();
    
  }
  
  Ball.prototype.stop = function() {
    this.body.view.scale.set(1, 1);
    this.body.treatment = 'static';
    this.staticAnim = new TimelineMax({yoyo: true, repeat: -1});
    this.staticAnim.to(this.body.view.scale, 0.2, {x: 0.8, y: 0.9});
    
    this.body.state.pos.x = this.renderer.width/2;
    this.body.state.pos.y = 210;
    
  }
  
  Ball.prototype.trail = function() {
    var particle = new Game.Particle(this.body.state.pos.x, this.body.state.pos.y, {
      rainbow: this.rainbowMode,
      color: this.colorTrail
    });
    
    particle.fire();  
    setTimeout(this.trail.bind(this), TRAIL_PARTICLE_DELAY);
  }
  
  Ball.prototype.active = function() {
    this.staticAnim.clear();
    this.body.view.scale.set(1, 1);
    this.lineLyric = 0;
    this.body.treatment = 'dynamic';
  }
  
  Ball.prototype.getBody = function() {
    return this.body;
  }
  
  Ball.prototype.getEvents = function() {
    return {
      'collisions:detected': this.onCollision.bind(this)
    };
  }
  
  Ball.prototype.onCollision = function(data) {
    var self = this;
    var colliders = data.collisions;
    
    var isBumpAllowed = false;
    for(var i in colliders) {
      
      var collider = colliders[i]
      , bodyA = collider.bodyA
      , bodyB = collider.bodyB
      , platformCollider = null
      , ballCollider = null;
      
      if(bodyA.idName == self.idName) {
        ballCollider = bodyA;
        platformCollider = bodyB;  
      } else if(bodyB.idName == self.idName) {
        ballCollider = bodyB;
        platformCollider = bodyA;
      }
      
      if(ballCollider
        && ballCollider.state.pos.y < platformCollider.state.pos.y
      ) {
        isBumpAllowed = true;   
        break;
      }
      
    }
    
    if(isBumpAllowed) {
      
      var vxBall = this.body.state.vel.x;
      this.body.state.vel.set(vxBall, JUMP_BY); // Force vy to be exactly the same no matter what  
      this.nextLyric();
      
      // if(platformCollider.idName == PLATFORM_TUTO) {
      //   var vxPlatform = platformCollider.state.vel.x;
      //   platformCollider.state.vel.set(vxPlatform, PLATFORM_SPEED);
      // }
      
    }
    
    if(this.onAfterCollision) {
      this.onAfterCollision();
    }
    
  }
  
  Ball.prototype.nextLyric = function() {
    var now = Date.now();
    if(this.lastCollisionTime
      && now - this.lastCollisionTime < 10
    ) {
      return
    }
    
    this.lastCollisionTime = now;
    
    var onSeConnait = Resource.Lyrics.onSeConnait;
    if(!this.lineLyric || !onSeConnait[this.lineLyric]) {
      this.lineLyric = 0;
    }
    
    var widthScene = Share.get('width');
    var onomatope = onSeConnait[this.lineLyric];
    
    var text = new PIXI.extras.BitmapText(onomatope, {
      font: "30px OogieBoogie"
    });
    
    text.position.y = this.body.state.pos.y - 30;
    text.position.x = this.body.state.pos.x + 30;
    var xEnd = text.position.x + text.width;
    if(xEnd > widthScene) {
      var diff = xEnd - widthScene;
      text.position.x -= diff + 40;
      if(text.position.x < 0) {
        text.position.x = 20;
        text.scale.set(0.8, 0.8);
      } 
      text.position.y += 40; 
    }
    
    
    var stage = Share.get('stage');
    stage.addChild(text);
    TweenMax.to(text.position, 0.5, {y: '-=50', onComplete: function(){
      stage.removeChild(text);
    }});
    
    
    this.lineLyric++;
  }
  
  Ball.prototype.setTrail = function(color) {
    this.colorTrail = color;
  }
  
  Ball.prototype.update = function() {
    if(this.onMove) {
      this.onMove(this.body.state.pos);
    }
  }
  
  exports.Ball = Ball;

})(window.Game = window.Game || {})