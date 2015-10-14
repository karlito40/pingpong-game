/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
/// <reference path="./IPoint.ts"/>
/// <reference path="./EPlatform.ts"/>
/// <reference path="./Config.ts"/>
/// <reference path="../../core/resources/Share.ts"/>

module PingPong {
  
  var Share = Resource.Share;
  var HEIGHT = 4;
  
  export class Platform {
    
    protected body;
    protected type: PLATFORM_TYPE;
    x;
    
    constructor(from: IPoint, to: IPoint, type: PLATFORM_TYPE) {
      
      this.type = type;
      
      var deltaX = to.x - from.x;
      var deltaY = to.y - from.y;
      var w = Math.abs(deltaX); 
      var h = Math.abs(deltaY);
      
      var width = Math.sqrt( Math.pow(w, 2) + Math.pow(h, 2) );
      var angle = Math.atan2(deltaY, deltaX);
      
      this.body = Physics.body('rectangle', {
        width: width,
        height: HEIGHT,
        x: from.x,
        y: from.y,
        vy: (this.type) ? Config.PLATFORM_SPEED : 0,
        cof: 1,
        restitution: 1,
        angle: angle,
        treatment: 'kinematic',
        offset: Physics.vector(width/2, 0)
      });
      this.body.className = 'trampoline';
      this.body.platform = this;
      
      var lineTexture = Share.get('resources').line.texture;
      var circleTexture = Share.get('resources').circle.texture;
      
      var lineContainer = new PIXI.Container();
      var tilingSprite = new PIXI.extras.TilingSprite(lineTexture, width, HEIGHT);
      var leftCircle = new PIXI.Sprite(circleTexture);
      var rightCircle = new PIXI.Sprite(circleTexture);
      
      leftCircle.anchor.set(0.5, 0.5);
      rightCircle.anchor.set(0.5, 0.5);
      rightCircle.position.x = width;
      tilingSprite.position.y = -2;
        
      lineContainer.addChild(tilingSprite);
      lineContainer.addChild(leftCircle);
      lineContainer.addChild(rightCircle);
      
      this.body.view = Share.get('renderer').createDisplay('view', {
        view: lineContainer
      });
      
    }
    
    fall(): void {
      this.setType(PLATFORM_TYPE.FALL);
    }
    
    setType(type: PLATFORM_TYPE): void {
      if(this.type == type) {
        return;
      }
      
      this.type = type;
      if(this.type == PLATFORM_TYPE.FALL) {
        this.body.sleep(false)  
        this.body.state.vel.y = Config.PLATFORM_SPEED;
      } else {
        throw new Error('setType static not implemented yet');
      }
    }
    
    getBody(): any {
      return this.body;
    } 
   
  }
  
}