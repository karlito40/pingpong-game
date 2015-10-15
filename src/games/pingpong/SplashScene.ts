/// <reference path="../../core/scenes/SplashScene.ts"/>
module PingPong {
  export class SplashScene extends Scene.SplashScene {
   
    buildLogo(): PIXI.Sprite {
      var logoTexture = this.Share.get('resources')['youssy-splash'].texture;
      var logo = new PIXI.Sprite(logoTexture);
      logo.scale.set(0.8, 0.8);
      
      return logo;
    } 
   
  }
}