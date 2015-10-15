/// <reference path="./SplashScene.ts"/>
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>

module Scene {
  export class FantouchScene extends SplashScene {
    
    constructor(auto?: boolean, color?: number) {
      super(auto, color || 0x048cff);
    }
    
    buildLogo(): PIXI.Sprite {
      
      var logoTexture = this.Share.get('resources')['fantouch'].texture;
      var logo = new PIXI.Sprite(logoTexture);
      logo.scale.set(0.8, 0.8);
      
      return logo;      
    }
    
  }
}      
      