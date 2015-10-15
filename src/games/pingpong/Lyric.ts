/// <reference path="../../core/resources/Share.ts"/>

module PingPong {
  
  var Share = Resource.Share;
  
  export class Lyric {
    
    static config = [{
      artist: 'youss',
      songs: [{
        title: 'LE SCORE',
        lines: [
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "ne pas ceder",
          "on s'en sort",
          "fais peter LE SCORE",
          "j'suis en plein essor",
          "on s'en sort",
          "fais peter LE SCORE",
          "on s'en sort",
          "fais peter LE SCORE",
          "fais peter LE SCORE",
          "on s'en sort",
          "j'fais peter LE SCORE",
          "peter LE SCORE",
          "on s'en sort",
          "j'suis en plein essor",
        ]  
      }] 
    }];
    
    protected line: number;
    protected lastCollisionTime: number;
    protected song;
    
    constructor() {
      var artistMap = Lyric.config[~~(Math.random()*Lyric.config.length)];
      var songs = artistMap.songs;
      
      this.song = songs[~~(Math.random()*songs.length)];
      
      this.line = 0;
    }
    
    next(position): void {
      var now = Date.now();
      if(this.lastCollisionTime
        && now - this.lastCollisionTime < 25
      ) {
        return
      }
      
      this.lastCollisionTime = now;
      if(!this.line || !this.song.lines[this.line]) {
        this.line = 0;
      }
      
      var widthScene = Share.get('width');
      var onomatope = this.song.lines[this.line];
      var text = new PIXI.Text(onomatope, {
        font: "20px Gobold",
        fill: 0xFFFFFF
      });
      text.position.y = position.y - 30;
      text.position.x = position.x + 30;
      var xEnd = text.position.x + text.width;
      if(xEnd > widthScene) {
        var diff = xEnd - widthScene;
        text.position.x -= diff + 40;
        if(text.position.x < 0) {
          text.position.x = 20;
          text.scale.set(0.8, 0.8);
        } 
        text.position.y += 40; 
      }
      
      
      var stage = Share.get('stage');
      stage.addChild(text);
      TweenMax.to(text.position, 0.5, {y: '-=50', onComplete: function(){
        stage.removeChild(text);
      }});
      
      this.line++;
    
    }
     
    
  }
}

