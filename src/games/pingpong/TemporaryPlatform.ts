/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="./IPoint.ts"/>
/// <reference path="./Config.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="../../core/resources/Style.ts"/>

module PingPong {
  
  var Share = Resource.Share;
  var Style = Resource.Style;
  
  export class TemporaryPlatform extends PIXI.Container{
    
    
    constructor(from: IPoint, to: IPoint) {
     super();
     
      var circleTexture = Share.get('resources').circle.texture;
      var p1 = new PIXI.Sprite(circleTexture);
      p1.anchor.set(0.5, 0.5);
      p1.position.set(from.x, from.y);
      
      var p2 = new PIXI.Sprite(circleTexture);
      p2.anchor.set(0.5, 0.5);
      p2.position.set(to.x, to.y);
      
      var lineMaker = Share.get('renderer').createLine(from, to, Style.get('line'));
      
      this.addChild(lineMaker);
      this.addChild(p1);
      this.addChild(p2);
      
     
     
    }
    
    
  }
  
}