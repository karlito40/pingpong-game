'use strict';

var Share = Resource.Share || {}
, PIXI = PIXI || {}
, TimelineMax = TimelineMax || {}
, TweenMax = TweenMax || {};

(function(exports){
  
  function degToRad(deg) {
    return deg*PIXI.DEG_TO_RAD;
  }
    
  function TutorialScreen() {
    this.onClose = null;
    this.stage = Share.get('stage');
    this.isActive = false;
    
  }
  
  TutorialScreen.prototype.start = function() {
    
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
    var youssyText = new PIXI.extras.BitmapText("Youssy", {font: "60px OogieBoogie"});
    youssyText.position.x = Share.get('width')/2 - youssyText.width/2;
    youssyText.position.y = 50;
    
    // var ballText = new PIXI.extras.BitmapText("Ball", {font: "60px OogieBoogie", tint: 0x1d2b38});
    var ballText = new PIXI.extras.BitmapText("Ball", {font: "60px OogieBoogie"});
    ballText.position.x = Share.get('width')/2 - ballText.width/2;
    ballText.position.y = 95;
    
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
    
    // Consigne
    
    // this.tipText = new PIXI.Container();
    // this.tipText = new PIXI.extras.BitmapText('Protect youss !', {
    //   font: "30px OogieBoogie",
    //   tint: 0x000000
    // });
    // this.tipText.alpha = 0;
    
    // this.tipText.position.x = width/2 - this.tipText.width/2 - 100;
    // this.tipText.position.y = 280;
    // this.container.addChild(this.tipText);
    
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
    bridgeContainer.position.y = 270;
    
    this.container.addChild(bridgeContainer);

    // Stylo
    var texture = Share.get('resources')['pencil'].texture;
    var pencil = new PIXI.Sprite(texture);
    
    pencil.pivot.set(pencil.width/2, pencil.height/2)
    
    pencil.position.x = bridgeContainer.position.x - pencil.width + pencil.width/2 + 20;
    pencil.position.y = bridgeContainer.position.y + pencil.height/2 + 5;
    
    this.container.addChild(pencil);


    // Youss charactere
    var youssTexture = Share.get('resources')['youss'].texture;
    this.youss = new PIXI.Sprite(youssTexture);
    // this.youss.scale.set
    
    this.youss.position.x = 10;
    this.youss.position.y = height;  
    
    this.container.addChild(this.youss);
    
    this.bubbleDial = new PIXI.Graphics();
    this.bubbleDial.beginFill(0xFFFFFF);
    this.bubbleDial.lineStyle(3, 0x000000, 1);
    
    var dialMargin = 20;
    var dialX = this.youss.width + this.youss.position.x - 10;
    var dialWidth = width - dialX - dialMargin;
    var dialHeight = 100;
    
    dialWidth = Math.min(dialWidth, 300);
    
    this.bubbleDial.drawRoundedRect(0, 0, dialWidth, dialHeight, 5);
    this.bubbleDial.endFill();
    
    this.bubbleDial.position.x = dialX;
    this.bubbleDial.position.y = height - this.youss.height + 70;
    
    this.bubbleDial.rotation = degToRad(40);
    this.bubbleDial.alpha = 0;
    
    var s = 'Reach the sky';
    // if(dialWidth < 150) {
    //   s = 'Reach the \nsky';
    // }
    // this.dialText = new PIXI.extras.BitmapText("Youssoupha's in da place !\n Yes papa ! Let's sing :)", {
    // this.dialText = new PIXI.extras.BitmapText(s, {
    //   font: "17px OogieBoogieMin",
    //   wordWrap: true,
    //   wordWrapWidth: dialWidth - 50,
    //   maxWidth: 100,
    //   // align: 'center',
    //   tint: 0x000000
    // });
    
    this.dialText = new PIXI.Text(s, {
      font: "17px Arial",
      wordWrap: true,
      wordWrapWidth: dialWidth - 20,
    });
    
    this.dialText.position.x = 10;
    this.dialText.position.y = 10;
    this.bubbleDial.addChild(this.dialText);
    
    // var staggerTextDial = [];
    // this.dialText.children.forEach(function(letter) {
    //   letter.alpha = 0;
    //   // letter.pivot.set(letter.width/2, 0)
    //   // letter.pivot.set(letter.width/2, letter.height/2)
    //   letter.rotation = degToRad(180);
    //   staggerTextDial.push(letter)
    // });
    
    this.container.addChild(this.bubbleDial);
    
    
    this.stage.addChildAt(this.container, 2);
    
    /**
     * animation
     */
    
    this.tlTuto = new TimelineMax();
    this.tlTuto.to(bg, 1, {alpha: 0.4}, 'start');
    this.tlTuto.staggerTo(toStagger, 0.8, {x: 1, y: 1, ease: Elastic.easeOut}, 0.1, 'start+=0.3');
    this.tlTuto.to(this.youss.position, 0.2, {y: '-=' + this.youss.height});
    this.tlTuto.to(this.bubbleDial, 0.1, {alpha: 1}, '-=0.1');
    this.tlTuto.to(this.bubbleDial.position, 0.2, {y: '-=50'}, '-=0.15');
    this.tlTuto.to(this.bubbleDial, 1, {rotation: 0, ease: Elastic.easeOut}, '-=0.2');
    // this.tlTuto.staggerTo(staggerTextDial, 0.3, {rotation: degToRad(0), alpha: 1}, 0.03, '-=0.7');
    
    
    var pencilDestX = bridgeWidth + pencil.width/2 + 13;
    
    // Animation platform maker
    var bridgeDuration = 0.7;
    this.tlPlatformMaker = new TimelineMax({repeat: -1, repeatDelay: 0.5});
    this.tlPlatformMaker.to(line, bridgeDuration, {width: bridgeWidth}, 'start'); 
    this.tlPlatformMaker.to(rightCircle.position, bridgeDuration, {x: '+=' + bridgeWidth}, 'start'); 
    this.tlPlatformMaker.to(pencil.position, bridgeDuration, {y: '+=3', x: '+=' + pencilDestX}, 'start'); 
    this.tlPlatformMaker.to(pencil, bridgeDuration, {rotation: degToRad(-70)}, 'start'); 
    
  }
  
  TutorialScreen.prototype.close = function() {
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
    tl.to([this.youss.position, this.bubbleDial.position], 0.3, {y: '+=' + this.youss.height}, 'start');
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
  
  exports.TutorialScreen = TutorialScreen; 
})(window.Game = window.Game || {})