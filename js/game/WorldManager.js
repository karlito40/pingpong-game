'use strict';

var Physics = Physics || {}
, Share = Resource.Share 
, world;


Physics(function (w) {
  world = w;
});

(function(exports){
  
  function WorldManager(options) {
    var self = this;
    
    this._world = world;
    this.updates = [];
    
    this._renderer = Physics.renderer('pixi', {
      el: 'viewport',
      meta: DEBUG,
      autoResize: true,
      // height: window.innerHeight,
      styles: {
        'color': Resource.StyleSheet.background,
        'circle' : Resource.StyleSheet.circle,
        'rectangle': Resource.StyleSheet.line
      }
    });
    
    var gravity = Physics.behavior('constant-acceleration', {
      acc: { x : 0, y: GRAVITY } 
    });
    
    var interaction = Physics.behavior('interactive', { el: this._renderer.el })
        .applyTo(world.find({ name: 'box' }))
    
    this._world.on('step', function () {
      self._world.render();
      self.updates.forEach(function(cb){
        cb();
      });
    });
    
    this.garbage();
    
    world.add([
      this._renderer,
      gravity,
      interaction,
      Physics.behavior('body-impulse-response'),
      Physics.behavior('body-collision-detection'),
      Physics.behavior('sweep-prune'),
      // edgeBounce
    ]);

    Physics.util.ticker.on(function (time, dt) {
      Share.set('dt', dt);
      world.step(time);
    });
    
    Share.set('width', this._renderer.width);
    Share.set('height', this._renderer.height);
    Share.set('renderer', this._renderer);
    Share.set('stage', this._renderer.stage);
    Share.set('world_manager', this);
    
  }
  
  WorldManager.prototype.addEvents = function(events) {
    var joinEvents = {};
    // TODO:: Util merge
    events.forEach(function(event){
      for(var key in event) {
        joinEvents[key] = event[key];
      }
    });
    
    this._world.on(joinEvents);
  }
  
  WorldManager.prototype.addBody = function(objects) {
    if(Array.isArray(objects)) {
      var self = this;
      objects.forEach(function(object){
        self._world.add(object);  
      });  
    } else {
      this._world.add(objects);
    }
    
  }
  
  WorldManager.prototype.removeBody = function(object) {
    this._world.remove(object);
  }
  
  WorldManager.prototype.addUpdate = function(cb) {
    this.updates.push(cb);
  }
  
  WorldManager.prototype.garbage = function(types) {
    var bodies = this._world.getBodies();
    
    var self = this;
    // May be dangerous if you are placing things for animation, etc...
    // But it's ok at this moment
    bodies.forEach(function(body){
      if(body.className
        && GARBAGE_TYPE.indexOf(body.className) != -1 
        && body.state.pos.y > self._renderer.height
      ) {
        self._world.remove(body);
      }
    });
    
    setTimeout(this.garbage.bind(this), GARBAGE_DELAY)
  }
  
  WorldManager.prototype.removeBodies = function(types) {
   var bodies = this._world.getBodies(); 
   var self = this;
   
   bodies.forEach(function(body){
    if(body.className
      && GARBAGE_TYPE.indexOf(body.className) != -1
    ) {
      self._world.remove(body);
    }  
   });
   
  }
  
  WorldManager.prototype.getWorld = function() {
    return this._world;
  }
  
  WorldManager.prototype.getRenderer = function() {
    return this._renderer;
  }
  
  WorldManager.prototype.getStage = function() {
    return this.getRenderer().stage;
  }
  
  exports.WorldManager = WorldManager;
  
})(window.Game = window.Game || {})

