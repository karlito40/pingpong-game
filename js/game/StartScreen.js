'use strict';

var Share = Resource.Share || {}
, PIXI = PIXI || {}
, TimelineMax = TimelineMax || {}
, TweenMax = TweenMax || {}
, Sys = Sys || {};

(function(exports){
    
  function StartScreen() {
    this.onClose = null;
    this.stage = Share.get('stage');
    this.isActive = false;
    
  }
  
  StartScreen.prototype.start = function() {
    this.record = Sys.Storage.get('altitudeRecord') || 0;
    this.nbGame = Sys.Storage.get('nbGame') || 0;
    
    this.isActive = true; 
    
    this.container = new PIXI.Container();
    
    var width = Share.get('width') 
    , height = Share.get('height');
    
    var bg = new PIXI.Graphics();
    
    bg.beginFill(0x000000);
    bg.drawRect(0, 0, width, height);
    bg.endFill();
    
    // bg.alpha = 0.2;
    bg.alpha = 0;
    
    this.container.addChild(bg);
    
    this.logoContainer = new PIXI.Container();
    var youssyText = new PIXI.extras.BitmapText("Scribble", {font: "60px OogieBoogie"});
    youssyText.position.x = Share.get('width')/2 - youssyText.width/2;
    // youssyText.position.y = 50;
    youssyText.position.y = 75;
    
    // var ballText = new PIXI.extras.BitmapText("Ball", {font: "60px OogieBoogie", tint: 0x1d2b38});
    var ballText = new PIXI.extras.BitmapText("Ball", {font: "60px OogieBoogie"});
    ballText.position.x = Share.get('width')/2 - ballText.width/2;
    // ballText.position.y = 95;
    ballText.position.y = 115;
    
    this.logoContainer.addChild(youssyText);
    this.logoContainer.addChild(ballText);
    
    var toStagger = [];
    this.logoContainer.children.forEach(function(line){
      line.children.forEach(function(letter){
        letter.scale.set(0, 0);
        toStagger.push(letter.scale);
      });
    });
    
    
    this.container.addChild(this.logoContainer);
 
    // Record
    this.recordContainer = new PIXI.Container();
    this.recordContainer.position.y = 15;
    
    var recordBgTexture = Share.get('resources')['bg-record'].texture;
    var recordBg = new PIXI.extras.TilingSprite(recordBgTexture, 80, 23);
    recordBg.scale.x = 1.15;
    recordBg.scale.y = 1.15;
    
    this.recordContainer.addChild(recordBg);
    
    var recordText = new PIXI.extras.BitmapText(this.record.toString(), {
      font: "20px OogieBoogieMin"
    });
    
    recordText.position.y = -2;    
    recordText.position.x = this.recordContainer.width - recordText.width - 25;    
    
    this.recordContainer.addChild(recordText);
    
    var ballTexture = Share.get('resources')['youssy-ball'].texture;
    var recordIco = new PIXI.Sprite(ballTexture);
    recordIco.scale.set(0.6);
    recordIco.position.y = -2;
    recordIco.position.x = this.recordContainer.width - 20;
    
    this.recordContainer.addChild(recordIco);
    
    
    this.container.addChild(this.recordContainer);

    // Party 
    this.nbGameContainer = new PIXI.Container();
    this.nbGameContainer.position.y = 50;
    
    var nbGameTexture = Share.get('resources')['bg-party'].texture;
    var nbGameBg = new PIXI.extras.TilingSprite(nbGameTexture, 60, 23);
    nbGameBg.scale.x = 1.15;
    nbGameBg.scale.y = 1.15;
    this.nbGameContainer.addChild(nbGameBg);
    
    var nbGameText = new PIXI.extras.BitmapText(this.nbGame.toString(), {
      font: "20px OogieBoogieMin"
    });
    nbGameText.position.y = -1;    
    nbGameText.position.x = this.nbGameContainer.width - nbGameText.width - 25;    
    
    this.nbGameContainer.addChild(nbGameText);
    
    var ballTexture = Share.get('resources')['youssy-ball'].texture;
    var nbGameIco = new PIXI.Sprite(ballTexture);
    nbGameIco.scale.set(0.6);
    nbGameIco.position.y = -2;
    nbGameIco.position.x = this.nbGameContainer.width - 20;
    
    this.nbGameContainer.addChild(nbGameIco);
    
    this.container.addChild(this.nbGameContainer);
 
 
    // Building bridge
    var circleTexture = Share.get('resources').circle.texture;
    var lineTexture = Share.get('resources').line.texture;
    
    var bridgeWidth = 150;    
    
    var bridgeContainer = new PIXI.Container();
    var leftCircle = new PIXI.Sprite(circleTexture);
    var rightCircle = new PIXI.Sprite(circleTexture);
    var line = new PIXI.extras.TilingSprite(lineTexture, 1, 4);
    
    line.position.x = leftCircle.width - 1;
    line.position.y = leftCircle.height/2 - line.height/2 - 1;
    
    rightCircle.position.x = line.position.x + line.width - 2;
    
    bridgeContainer.addChild(leftCircle);
    bridgeContainer.addChild(line);
    bridgeContainer.addChild(rightCircle);
    
    bridgeContainer.position.x = width/2 - bridgeContainer.width/2 - bridgeWidth/2;
    bridgeContainer.position.y = 290;
    
    this.container.addChild(bridgeContainer);

    // Stylo
    var texture = Share.get('resources')['pencil'].texture;
    var pencil = new PIXI.Sprite(texture);
    
    pencil.pivot.set(pencil.width/2, pencil.height/2)
    
    pencil.position.x = bridgeContainer.position.x - pencil.width + pencil.width/2 + 20;
    pencil.position.y = bridgeContainer.position.y + pencil.height/2 + 5;
    
    this.container.addChild(pencil);

    
    this.stage.addChildAt(this.container, 2);
    
    /**
     * animation
     */
    
    
    this.nbGameContainer.position.x = -110;
    this.recordContainer.position.x = -110;
    
    this.tlTuto = new TimelineMax();
    this.tlTuto.to(bg, 1, {alpha: ALPHA_TUTO}, 'start');
    
    this.tlTuto.staggerTo(toStagger, 0.8, {x: 1, y: 1, ease: Elastic.easeOut}, 0.1, 'start+=0.3');
    // this.tlTuto.to(this.youss.position, 0.2, {y: '-=' + this.youss.height});
    // this.tlTuto.to(this.bubbleDial, 0.1, {alpha: 1}, '-=0.1');
    // this.tlTuto.to(this.bubbleDial.position, 0.2, {y: '-=50'}, '-=0.15');
    // this.tlTuto.to(this.bubbleDial, 1, {rotation: 0, ease: Elastic.easeOut}, '-=0.2');
    this.tlTuto.staggerTo([
      this.recordContainer.position, 
      this.nbGameContainer.position
    ], 0.5, {x: -10, ease: Back.easeOut}, 0.2, 'start');
    
    var pencilDestX = bridgeWidth + pencil.width/2 + 13;
    
    this.platform = [
      line,
      rightCircle,
      leftCircle,
      pencil
    ];
    
    // Animation platform maker
    var bridgeDuration = 0.7;
    this.tlPlatformMaker = new TimelineMax({repeat: -1, repeatDelay: 0.5});
    this.tlPlatformMaker.to(line, bridgeDuration, {width: bridgeWidth}, 'start'); 
    this.tlPlatformMaker.to(rightCircle.position, bridgeDuration, {x: '+=' + bridgeWidth}, 'start'); 
    this.tlPlatformMaker.to(pencil.position, bridgeDuration, {y: '+=3', x: '+=' + pencilDestX}, 'start'); 
    this.tlPlatformMaker.to(pencil, bridgeDuration, {rotation: Util.Math2.degToRad(-70)}, 'start'); 
    
    
  }
  
  StartScreen.prototype.close = function() {
    var self = this;
    
    if(!this.isActive) {
      return;
    }
    
    if(this.tlPlatformMaker) {
      this.tlPlatformMaker.clear();
      this.tlPlatformMaker = null;  
    }
    
    if(this.tlTuto) {
      this.tlTuto.clear();
      this.tlTuto = null;
    }
    
    this.isActive = false;
    
    var tl = new TimelineMax();
    tl.to(this.logoContainer.position, 0.3, {y: -300}, 'start');
    tl.to(this.platform, 0.15, {alpha:0}, 'start');
    tl.to([
      this.recordContainer.position,
      this.nbGameContainer.position
    ], 0.3, {x: -100}, 'start');
    // tl.to([this.youss.position, this.bubbleDial.position], 0.3, {y: '+=' + this.youss.height}, 'start');
    tl.to(this.container, 0.6, {alpha: 0});
    
    tl.call(function(container){
      return function() {
        self.stage.removeChild(container);  
      } 
    }(this.container));
    
    if(this.onClose) {
      this.onClose();
    }
  }
  
  exports.StartScreen = StartScreen; 
})(window.Game = window.Game || {})