/// <reference path="./Platform.ts"/>
/// <reference path="./IPoint.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="./EPlatform.ts"/>
/// <reference path="./TemporaryPlatform.ts"/>
/// <reference path="../../core/resources/Share.ts"/>

module PingPong {
  
  var Share = Resource.Share;
  
  export class PlatformManager {
    
    protected active: boolean;
    protected draging: boolean;
    protected nbPlatform: number;
    
    protected from: IPoint;
    protected to: IPoint;
    protected buildingPlatform: TemporaryPlatform;
    // protected buildingPlatform: Platform;
    protected staticPlatforms: Array<Platform>;
    protected physic: Physic;
    
    protected lastMove: number;
    protected platformSpeed: number;
    
    onBuild: Function;
    
    constructor(physic: Physic) {
      
      this.active = false;
      this.physic = physic;
      this.draging = false;
      this.from = null;
      this.to = null;
      this.onBuild = null;
      this.buildingPlatform = null;
      this.staticPlatforms = [];
      this.lastMove = 0;
            
      this.nbPlatform = 0;
      this.platformSpeed = Config.PLATFORM_SPEED_MIN;
      
      this.physic.addEvents([
        this.getPhysicsEvents()
      ]);
    }
    
    start(): void {
      this.active = true;
    }
    
    stop(): void {
      this.active = false;
      this.nbPlatform = 0;
      this.platformSpeed = Config.PLATFORM_SPEED_MIN;
      
    }
    
    onPoke(pos: IPoint): void {
      this.from = pos; 
    }
    
    onMove(pos: IPoint): void {
      this.to = pos; 
      if(!this.from || !this.to) {
        return;
      }
      
      // var now = Date.now();
      // if(now - this.lastMove < 15) {
      //   return;
      // }
      // this.lastMove = now;
      
      // // Well that sucks
      // this.cleanBuildingPlatform();
      
      // this.buildingPlatform = new Platform(this.from, this.to, PLATFORM_TYPE.STATIC);
      // this.physic.addBody(this.buildingPlatform.getBody());
      
      // this.buildingPlatform.onBallCollision = this.onRelease.bind(this);   
        
      this.cleanBuildingPlatform();
      this.buildingPlatform = new TemporaryPlatform(this.from, this.to);
      Share.get('stage').addChild(this.buildingPlatform);
    }
    
    onRelease(): void {
      if(!this.from || !this.to) {
        return;
      }
      
      this.draging = false;
      this.cleanBuildingPlatform(); 
      this.disableStaticPlatform();
      
      var type = (this.nbPlatform) ? PLATFORM_TYPE.FALL : PLATFORM_TYPE.STATIC;
      
      var finalPlatform = new Platform(this.from, this.to, type, this.platformSpeed);
      this.physic.addBody(finalPlatform.getBody());
      
      if(type == PLATFORM_TYPE.STATIC) {
        this.staticPlatforms.push(finalPlatform);
      }
      
      this.from = null;
      this.to = null;
      this.nbPlatform++;
      
      if(this.onBuild) {
        this.onBuild(finalPlatform);
      }
    }
    
    disableStaticPlatform(): void {
      if(!this.staticPlatforms.length) {
        return;
      }

      this.staticPlatforms.forEach(function(platform) {
        platform.setType(PLATFORM_TYPE.FALL);
      });
      
      this.staticPlatforms.length = 0;
    }
    
    getPhysicsEvents(): Object {
      return {
        'interact:poke': this.onPoke.bind(this),
        'interact:move': this.onMove.bind(this),
        'interact:release': this.onRelease.bind(this)
      }
    }
    
    isDraging(): boolean {
      return this.draging;
    }
    
    getNbPlatform(): number {
      return this.nbPlatform;
    }
    
    incrPlatformSpeed(): void {
      this.platformSpeed = Math.min(this.platformSpeed+0.05, Config.PLATFORM_SPEED_MAX);
    }
    
    private cleanBuildingPlatform(): void {
      if(this.buildingPlatform) {
        // this.physic.removeBody(this.buildingPlatform.getBody());  
        Share.get('stage').removeChild(this.buildingPlatform);
        this.buildingPlatform = null;
      }
    }
    
  }  
  
}