/// <reference path="./Viewport.ts"/>
/// <reference path="../../core/scenes/BaseScene.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>

module PingPong {
  export class GameScene extends Scene.BaseScene {
    
    protected world: PhysicsWorld;
    protected viewport: Viewport;
    
    constructor(world: PhysicsWorld) {
      super('GameScene');  
      this.world = world;
      this.viewport = new Viewport();
    }
    
    create() {
      var bg = new PIXI.Graphics();
      bg.beginFill(0xfae337);
      bg.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
      bg.endFill();
      
      this.addChild(bg);
    }
    
    logic() {
      console.log('GameScene :)')
    }
     
  }
}