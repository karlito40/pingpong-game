/// <reference path="./BaseScene.ts"/>

module Scene {
  export class SplashScene extends BaseScene {
    
    static MIN_DISPLAY = 1000;
    
    protected color: number;
    protected startAt: number;
    
    constructor(color?: number) {
      super('SplashScene');
      this.color = color || 0x048cff;  
    }
    
    create(): void {
      var graph = new PIXI.Graphics();
      graph.beginFill(this.color);
      graph.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
      graph.endFill();
      
      this.addChild(graph);
      
      var logoTexture = this.Share.get('resources')['fantouch'].texture;
      var logo = new PIXI.Sprite(logoTexture);
      logo.scale.set(0.8, 0.8);
      logo.anchor.set(0.5, 0.5);
      logo.position.set(this.Share.get('width')/2, this.Share.get('height')/2);
      
      this.addChild(logo);
    }
    
    logic(): void {
      // setTimeout(() => {
      //   this.close();  
      // }, 3000)
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