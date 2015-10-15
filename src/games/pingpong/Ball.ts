/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="./Config.ts"/>  
/// <reference path="./Physic.ts"/>  
/// <reference path="../../../typings/greensock/greensock.d.ts"/>

module PingPong {
  var Share = Resource.Share;
  
  export class Ball {
    
    protected body;
    protected idName: string;
    protected active: boolean;
    protected physic: Physic;
    protected staticAnim: TimelineMax;
    
    onBump: Function;
    onLost: Function;
    
    constructor(physic: Physic) {
      this.active = false;
      this.physic = physic;
      this.onLost = null;
      
      this.body = Physics.body('circle', {
        radius: 25,
        x: Share.get('width')/2,
        y: 210,
        restitution: 1,
        cof: 1,
        mass: 1000,
        angle: 0,
        treatment: 'static'
      });
      
      this.idName = 'ball';
      this.body.idName = this.idName;
      var ballTexture = Share.get('resources')['youssy-ball'].texture;
      this.body.view = Share.get('renderer').createDisplay('sprite', {
        texture: ballTexture,
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
      
      this.physic.addEvents([
        this.getPhysicsEvents()
      ]);
      
      this.stop();
      
    }
    
    update(): void {
      if(this.active 
        && (this.body.state.pos.y < Config.TOP_LIMIT 
          || this.body.state.pos.y > Share.get('height')) 
      ) {
        
        if(this.onLost) {
          this.onLost();
        }
      }
    }
    
    start(): void {
      this.active = true;
      // this.body.view.scale.set(1, 1);
      this.body.treatment = 'dynamic';
    }
    
    stop(): void {
      this.active = false;
      // this.body.view.scale.set(1, 1);
      this.body.treatment = 'static';
      
      this.body.state.pos.x = Share.get('width')/2;
      this.body.state.pos.y = 210;
      
      if(!this.staticAnim) {
        this.staticAnim = new TimelineMax({yoyo: true, repeat: -1});
        this.staticAnim.to(this.body.view.scale, 0.2, {x: 0.8, y: 0.9});  
      }
      
    }
    
    onCollision(data): void {
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
        // Force vy to be exactly the same no matter what
        var vxBall = this.body.state.vel.x;
        this.body.state.vel.set(vxBall, Config.JUMP_BY);   
        
        if(this.onBump) {
          this.onBump(this.body.state.pos);
        }
      }
      
      if(platformCollider) {
        // platformCollider.platform.fall();
        platformCollider.platform.ballCollision();
      }
    }
    
    getPhysicsEvents(): Object {
      return {
        'collisions:detected': this.onCollision.bind(this)
      }
    }
    

    
    getBody(): any {
      return this.body;
    }
    
  }
  
}