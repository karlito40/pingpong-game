/// <reference path="../../core/scenes/SplashScene.ts"/>
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>

module PingPong {
  export class SplashScene extends Scene.SplashScene {
   
    create(): void {
      super.create();
      
      var youssyText = new PIXI.Text("Le", {
        font: "35px Gobold",
        fill: 0xab8951
      });
      youssyText.position.x = this.Share.get('width')/2 - youssyText.width/2;
      
      var ballText = new PIXI.Text("Score", {
        font: "45px Gobold",
        fill: 0xab8951
      });
      ballText.position.y = youssyText.height - 12;
      ballText.position.x = this.Share.get('width')/2 - ballText.width/2;
      
      var container = new PIXI.Container();
      
      container.addChild(youssyText);
      container.addChild(ballText);
      
      container.position.y = this.Share.get('height')/2 - container.height/2;
      this.addChild(container);
      
    }
   
    buildLogo(): PIXI.Sprite {
      var logoTexture = this.Share.get('resources')['youssy-splash'].texture;
      var logo = new PIXI.Sprite(logoTexture);
      // logo.scale.set(0.8, 0.8);
      
      return logo;
    } 
   
  }
}