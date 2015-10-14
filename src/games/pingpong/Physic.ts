/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="./Config.ts"/>

module PingPong {
  var Style = Resource.Style;
  var Share = Resource.Share;
  
  export class Physic {
    
    protected world: PhysicsWorld;
    protected renderer: PixiRenderer;
    protected updates: Function[];
    
    constructor() {
      this.updates = [];
      
      Physics({}, this.onWorldReady.bind(this));
    }
    
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
      
      Share.set('width', this.renderer.width);
      Share.set('height', this.renderer.height);
      Share.set('renderer', this.renderer);
      Share.set('stage', this.renderer.stage);
      
      var gravity = Physics.behavior('constant-acceleration', {
        acc: { x : 0, y: Config.GRAVITY } 
      });

      this.world.add([
        this.renderer,
        gravity,
        Physics.behavior('body-impulse-response'), // TODO: Test perf without this
        Physics.behavior('body-collision-detection'),
        Physics.behavior('sweep-prune'),
        Physics.behavior('interactive', { el: this.renderer.el })
          .applyTo(world.find({ name: 'box' }))
        
      ]);
      
      Physics.util.ticker.on((time, dt) => {
        Share.set('dt', dt);
        this.world.step(time);
      });
      
      this.world.on('step', () => {
        this.world.render();
        this.updates.forEach(function(cb){
          cb();
        });
      });
      
      this.garbage();
    }
    
    addEvents(events: any) {
      events.forEach((event) => {
        for(var key in event) {
          console.log('add event', key);
          this.world.on(key, event[key]);
        }
      });
    }
    
    garbage() {
      var bodies = this.world.getBodies();
    
      bodies.forEach((body) => {
        if(body.className
          && Config.GARBAGE_TYPE.indexOf(body.className) != -1 
          && body.state.pos.y > this.renderer.height
        ) {
          this.world.remove(body);
        }
      });
    
      setTimeout(this.garbage.bind(this), Config.GARBAGE_DELAY);
    }
    
    addUpdate(cb: Function) {
      this.updates.push(cb);
    }
    
    addBody(objects): void {
      if(Array.isArray(objects)) {
        objects.forEach((object) => {
          this.world.add(object);
        });
      } else {
        this.world.add(objects);
      }
    }
    
    removeBody(object): void {
      this.world.remove(object);
    }
    
    getWorld(): PhysicsWorld {
      return this.world;
    }
    
  }
}