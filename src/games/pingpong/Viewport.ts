/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="./Config.ts"/>

module PingPong {
  
  var ALTITUDE_PADDING = 10;
  
  export class Viewport extends PIXI.Container {
    
    protected bg: PIXI.extras.TilingSprite;
    protected altitudeText: PIXI.extras.BitmapText;
    protected altitude: number;
    protected score: number;
    protected widthScene: number;
    protected heightScene: number;
    protected active: boolean;
    
    constructor() {
      super();
      
      this.widthScene = Resource.Share.get('width');
      this.heightScene = Resource.Share.get('height');
      
      this.active = false;
      this.altitude = 0;
      this.create();
      
    }
    
    start(): void {
      this.active = true;
      this.altitude = 0;
      this.score = 0;
    }
    
    stop(): void {
      this.active = false;
      this.score = this.altitude;
    }    
    
    private create(): void {
      // Background
      var cloudTexture = Resource.Share.get('resources')['bg-cloud'].texture;
      this.bg = new PIXI.extras.TilingSprite(cloudTexture, 1192, 800);
      
      this.addChild(this.bg);
      
      // Altitude Bitmap
      this.altitudeText = new PIXI.extras.BitmapText('', {font: "30px OogieBoogie"});
      this.replaceAltitudeText();
      
      this.addChild(this.altitudeText);
    }
    
    update(): void {
      this.setY(this.bg.tilePosition.y + Config.SCROLL_SPEED);
      
      if(this.active) {
        this.altitude += Config.SCROLL_SPEED;
        this.replaceAltitudeText();  
      }
      
    }
    
    private replaceAltitudeText(): void {
      this.altitudeText.text = this.altitude + ' m';
      this.altitudeText.position.x = this.widthScene - ALTITUDE_PADDING - this.altitudeText.width;
      this.altitudeText.position.y = ALTITUDE_PADDING;
    }
    
    setY(y: number): void {
      this.bg.tilePosition.y = y;
    }
    
    getAltitude(): number {
      return this.altitude;
    }
    
    getScore(): number {
      return this.score;
    }
  }
  
}