/// <reference path="./BaseScene.ts"/>
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>

module Scene {
  export abstract class SplashScene extends BaseScene {
    
    static MIN_DISPLAY = 1000;
    
    protected color: number;
    protected startAt: number;
    protected auto: boolean;
    
    abstract buildLogo(): PIXI.Sprite;
    
    constructor(auto?: boolean, color?: number) {
      super('SplashScene');
      this.color = color;  
      this.auto = auto || false; 
    }
    
    create(): void {
      var graph = new PIXI.Graphics();
      graph.beginFill(this.color);
      graph.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
      graph.endFill();
      
      this.addChild(graph);
      
      var logo = this.buildLogo();
      logo.anchor.set(0.5, 0.5);
      logo.position.set(this.Share.get('width')/2, this.Share.get('height')/2);
      
      this.addChild(logo);
    }
    
    logic(): void {
      if(this.auto) {
        setTimeout(() => {
          this.close();  
        }, SplashScene.MIN_DISPLAY + 500);  
      }
      
    }
    
    start(): void {
      this.startAt = Date.now();
      super.start();
    }
    
    close(): void {
      var dt: number = Date.now() - this.startAt;
      
      if(dt > SplashScene.MIN_DISPLAY) {
        super.close();  
      } else {
        setTimeout(this.close.bind(this), dt);
      }
      
    }
    

    
  }
}