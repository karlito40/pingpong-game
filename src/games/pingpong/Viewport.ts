/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="./Config.ts"/>
/// <reference path="./Constant.ts"/>
/// <reference path="../../core/resources/Storage.ts"/>

module PingPong {
  
  var Storage = Resource.Storage;
  var Share = Resource.Share;
  var ALTITUDE_PADDING = 10;
  
  export class Viewport extends PIXI.Container {
    
    protected bg: PIXI.extras.TilingSprite;
    protected altitudeText: PIXI.Text;
    protected altitude: number;
    protected score: number;
    protected widthScene: number;
    protected heightScene: number;
    protected active: boolean;
    protected record: number; 
    protected recordSepContainer: PIXI.Container; 
    protected sepContainer: PIXI.Container; 
    protected hasRecordDisplay: boolean; 
    protected steps: {}; 
    
    onStep: Function;
    
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
      this.hasRecordDisplay = false;
      this.steps = {};
      this.altitude = 0;
      this.score = 0;
      this.record = Storage.get(Constant.RECORD) || 0;
    }
    
    stop(): void {
      this.active = false;
      this.score = this.altitude;
      
      if(this.sepContainer) {
        var stage = Share.get('stage');
        stage.removeChild(this.sepContainer);
        this.sepContainer = null;
      }
      
      if(this.recordSepContainer) {
        var stage = Share.get('stage');
        stage.removeChild(this.recordSepContainer);
        this.recordSepContainer = null;
      }
    
    }    
    
    private create(): void {
      // Background
      var cloudTexture = Resource.Share.get('resources')['bg-cloud'].texture;
      this.bg = new PIXI.extras.TilingSprite(cloudTexture, 1192, 800);
      
      this.addChild(this.bg);
      
      // Altitude Bitmap
      this.altitudeText = new PIXI.Text('', {
        font: "18px Gobold",
        fill: 0xFFFFFF
      });
      this.replaceAltitudeText();
      
      this.addChild(this.altitudeText);
    }
    
    update(): void {
      this.setY(this.bg.tilePosition.y + Config.SCROLL_SPEED);
      
      if(this.active) {
        this.altitude += Config.SCROLL_SPEED;
        this.replaceAltitudeText();
        
        if(this.sepContainer) {
          this.sepContainer.position.y += Config.SCROLL_SPEED;
        }
        
        if(this.recordSepContainer) {
          this.recordSepContainer.position.y += Config.SCROLL_SPEED;
        }
        
        var currentStep = Math.floor((this.altitude + Share.get('height'))/Config.STEP_ALTITUDE);
      
        if(this.record
          && this.altitude >= this.record 
          && !this.hasRecordDisplay
          && Math.floor(this.altitude/Config.STEP_ALTITUDE) == currentStep
        ) {
          
          this.recordSepContainer = new PIXI.Container();
          
          var sepTexture = Share.get('resources').sep.texture;
          var sep = new PIXI.extras.TilingSprite(sepTexture, this.width, 9);
          sep.tint = 0xab8951;
          var stepText = new PIXI.Text('RECORD', {
            font: "30px Gobold",
            fill: 0xab8951
          });
          stepText.position.set(10, 10);
          
          this.recordSepContainer.addChild(sep);
          this.recordSepContainer.addChild(stepText);
          
          Share.get('stage').addChildAt(this.recordSepContainer, 1);
          
          this.hasRecordDisplay = true;
          
          
        }
        
        // Well it's bad sorry
        if(!this.steps[currentStep]) {
          
          this.steps[currentStep] = true;
          if(this.onStep) {
            this.onStep(currentStep);
          }
          
          if(currentStep > 0) {
           
            var stage = Share.get('stage');
            var sepTexture = Share.get('resources').sep.texture;
            
            if(this.sepContainer) {
              stage.removeChild(this.sepContainer);
            }
            
            this.sepContainer = new PIXI.Container();
            this.sepContainer.alpha = 0.3;
            
            var sep = new PIXI.extras.TilingSprite(sepTexture, this.width, 9);
          
            var stepInd = currentStep * Config.STEP_ALTITUDE;
            var stepText = new PIXI.Text(stepInd + ' m', {
              font: "30px Gobold",
              fill: 0xFFFFFF
            });
            stepText.position.set(10, 10);
            
            this.sepContainer.addChild(sep);
            this.sepContainer.addChild(stepText);
            
            stage.addChildAt(this.sepContainer, 1);  
          }
        
        }
        
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