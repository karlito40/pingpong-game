/// <reference path="./Ball.ts"/>  
/// <reference path="./Config.ts"/>
/// <reference path="./Config.ts"/>
/// <reference path="../../core/resources/Share.ts"/>

module PingPong {
  
  var Share = Resource.Share;
   
  export class Game {
    
    active: boolean;
    onEnd: Function;
    
    constructor() {
      this.active = false;
    }
    
    determineEnd(ball: Ball) {
      if(!this.active) {
        return;
      }
      
      var pos = ball.getBody().state.pos;
      if(pos.y < Config.TOP_LIMIT 
        || pos.y > Share.get('height') && this.active
      ) {
        this.end();
      }
      
    }
    
    start(): void {
      this.active = true;
    }
    
    stop(): void {
      this.active = false;
    }
    
    end(): void {
      if(this.onEnd) {
        this.onEnd();
      }
      
      this.stop();
    }
    
    isActive(): boolean {
      return this.active;
    }
    
  }
}