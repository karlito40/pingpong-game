/// <reference path="./Config.ts"/>
/// <reference path="../GameBase.ts"/>
/// <reference path="../../resources/Style.ts"/>
/// <reference path="../../resources/Share.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
module PingPong {
  
  var Style = Resource.Style;
  var Share = Resource.Share;
  
  export class Game extends GameBase {
    
    protected world: PhysicsWorld;
    protected renderer: PixiRenderer;
      
    constructor() {
      super();
      console.log('init ping pong game')

      Physics({}, this.onWorldReady.bind(this));
    }
    
    /**
     * World configuration
     */
    onWorldReady(world: PhysicsWorld): void {
      this.world = world;
      
      this.renderer = <PixiRenderer> Physics.renderer('pixi', {
        el: 'viewport',
        meta: Config.DEBUG,
        autoResize: true,
        styles: {
          'color': Style.get('background'),
          'circle': Style.get('circle'),
          'rectangle': Style.get('line')
        }
      });
      
      var gravity = Physics.behavior('constant-acceleration', {
        acc: { x : 0, y: Config.GRAVITY } 
      });

      this.world.add([
        this.renderer,
        gravity,
        Physics.behavior('body-impulse-response'),
        Physics.behavior('body-collision-detection'),
        Physics.behavior('sweep-prune')
      ]);
      
      Physics.util.ticker.on((time, dt) => {
        Share.set('dt', dt);
        this.world.step(time);
      });
      
      
      Share.set('width', this.renderer.width);
      Share.set('height', this.renderer.height);
      Share.set('renderer', this.renderer);
      Share.set('stage', this.renderer.stage);
      Share.set('world_manager', this);
      
    }  

  }  
}
