/// <reference path="../../core/popups/BasePopup.ts"/>
/// <reference path="../../core/utils/Math2.ts"/>
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="../../core/resources/Storage.ts"/>
/// <reference path="./Constant.ts"/>

module PingPong {
  
  var Share = Resource.Share;
  var Storage = Resource.Storage;
  
  export class StarterPopup extends Popup.BasePopup {
    
    protected logoContainer: PIXI.Container;
    protected recordContainer: PIXI.Container;
    protected scoreContainer: PIXI.Container;
    protected platformerContainer: PIXI.Container;
    protected dialogueContainer: PIXI.Graphics;
    protected pencil: PIXI.Sprite;
    protected character: PIXI.Sprite;
    protected platformLeft: PIXI.Sprite;
    protected platformRight: PIXI.Sprite;
    protected platformLine: PIXI.extras.TilingSprite;
    
    protected tlTuto: TimelineMax;
    protected tlPlatform: TimelineMax;
    
    protected record: number;
    protected nbGame: number;
    protected score: number;
    
    protected bridgeWidth: number;
    
    constructor(score?: number) {
      super();
      
      this.bridgeWidth = 150;
      this.tlTuto = null;
      this.tlPlatform = null;
      
      this.nbGame = Storage.get(Constant.NB_GAME) || 0;
      this.record = Storage.get(Constant.RECORD) || 0;
      this.score = score || 0;
    }
        
    create(): void {
      this.logoContainer = this.buildLogo();
      this.addChild(this.logoContainer);
      
      this.recordContainer = this.buildRecord();
      this.addChild(this.recordContainer);
      
      this.scoreContainer = this.buildScore();
      this.addChild(this.scoreContainer);
      
      this.platformerContainer = this.buildPlatformer();
      this.addChild(this.platformerContainer);
      
      this.pencil = this.buildPencil(this.platformerContainer.position);
      this.addChild(this.pencil);
      
      this.character = this.buildCharacter();
      this.addChild(this.character);
      
      this.dialogueContainer = this.buildDialogue();
      this.addChild(this.dialogueContainer);
      
      this.contentAnimation();
    }
    
    close(): void {
      if(!this.openState) {
        return ;
      }
      
      if(this.tlPlatform) {
        this.tlPlatform.clear();
        this.tlPlatform = null;
      }
      
      if(this.tlTuto) {
        this.tlTuto.clear();
        this.tlTuto = null;
      }
      
      var tl = new TimelineMax();
      tl.to(this.logoContainer.position, 0.3, {y: -300}, 'start');
      tl.to(this.platformerContainer, 0.15, {alpha:0}, 'start');
      tl.to([
        this.recordContainer.position,
        this.scoreContainer.position
      ], 0.13, {y: -200}, 'start');
      tl.to([
        this.character.position, 
        this.dialogueContainer.position
      ], 0.3, {y: '+=' + this.character.height}, 'start');
      
      super.close();
    }
    
    contentAnimation(): void {
      this.tlTuto = new TimelineMax();
      this.tlTuto.to(this.character.position, 0.2, {y: '-=' + (this.character.height - 10)});
      this.tlTuto.to(this.dialogueContainer, 0.1, {alpha: 1}, '-=0.1');
      this.tlTuto.to(this.dialogueContainer, 1, {rotation: 0, ease: Elastic.easeOut}, '-=0.2');
      
      var bridgeDuration = 0.7;
      var pencilDestX = this.bridgeWidth + this.pencil.width/2 + 13;
      
      this.tlPlatform = new TimelineMax({repeat: -1, repeatDelay: 0.5});
      this.tlPlatform.to(this.platformLine, bridgeDuration, {width: this.bridgeWidth}, 'start'); 
      this.tlPlatform.to(this.platformRight.position, bridgeDuration, {x: '+=' + this.bridgeWidth}, 'start'); 
      this.tlPlatform.to(this.pencil.position, bridgeDuration, {y: '+=3', x: '+=' + pencilDestX}, 'start'); 
      this.tlPlatform.to(this.pencil, bridgeDuration, {rotation: Util.Math2.degToRad(-70)}, 'start');
  
    }
    
    /**
     * Construct the logo container
     */
    private buildLogo(): PIXI.Container {
      var container = new PIXI.Container();
      
      var youssyText = new PIXI.Text("Youssy", {
        font: "45px Gobold",
        fill: 0xab8951
      });
      youssyText.position.x = Share.get('width')/2 - youssyText.width/2;
      
      var ballText = new PIXI.Text("Ball", {
        font: "45px Gobold",
        fill: 0xab8951
      });
      Share.set('ballText', ballText);
      ballText.position.x = Share.get('width')/2 - ballText.width/2 + 30;
      ballText.position.y = 39;
      
      container.addChild(youssyText);
      container.addChild(ballText);
      
      container.position.y = 70;
      
      return container;
      
    }
    
    /**
     * Construct the record container
     */
    private buildRecord(): PIXI.Container {
      
      var container = this.buildTextContainer(this.record.toString(), 'gold');
      container.position.y -= 5;
      container.position.x = Share.get('width')/2 - container.width - 2;
      
      return container;
    }
    
    private buildScore(): PIXI.Container {
      var container = this.buildTextContainer(this.score.toString(), 'brown');
      container.position.y -= 5;
      container.position.x = Share.get('width')/2 + 2;
      
      return container;
    }
    
    private buildTextContainer(text: string, color: string): PIXI.Container {
      var container = new PIXI.Container();
      
      var textContainer = new PIXI.Container();
      var recordText = new PIXI.Text(text, {
        font: "16px Gobold",
        fill: 0xFFFFFF
      });
      
      var shadowText = new PIXI.Text(text, {
        font: "16px Gobold",
        fill: 0x4c2815
      });
      shadowText.position.x = -1;
      shadowText.position.y = -1;
      
      textContainer.addChild(shadowText);
      textContainer.addChild(recordText);
      
      textContainer.position.y = 14;
      textContainer.position.x = 10;
      
      var leftCorner = new PIXI.Sprite(Share.get('resources')['left-' + color].texture);
      container.addChild(leftCorner);
      
      var center = new PIXI.extras.TilingSprite(Share.get('resources')['repeat-' + color].texture, textContainer.width + 20, 50);
      center.position.x = leftCorner.width;
      center.addChild(textContainer);
      
      container.addChild(center);
      
      var rightCorner = new PIXI.Sprite(Share.get('resources')['left-' + color].texture);
      rightCorner.scale.x = -1;
      rightCorner.position.x = container.width + leftCorner.width;

      container.addChild(rightCorner);
  
      
      return container;
    }
    
    /**
     * Construct the nb game play container
     */
    private buildNbGame(): PIXI.Container {
      var container = new PIXI.Container();
      container.position.y = 50;
      
      var nbGameTexture = Share.get('resources')['bg-party'].texture;
      var nbGameBg = new PIXI.extras.TilingSprite(nbGameTexture, 60, 23);
      
      container.addChild(nbGameBg);
      
      var nbGameText = new PIXI.extras.BitmapText(this.nbGame.toString(), {
        font: "15px OogieBoogieMin"
      });
      nbGameText.position.x = container.width - nbGameText.width - 25;    
      
      container.addChild(nbGameText);
      
      var ballTexture = Share.get('resources')['youssy-ball'].texture;
      var nbGameIco = new PIXI.Sprite(ballTexture);
      nbGameIco.scale.set(0.6);
      nbGameIco.position.y = -5;
      nbGameIco.position.x = container.width - 20;
      
      container.addChild(nbGameIco);
    
      return container;
    }
    
    /**
     * Build the platformer tutorial
     */
    private buildPlatformer(): PIXI.Container {
      var circleTexture = Share.get('resources').circle.texture;
      var lineTexture = Share.get('resources').line.texture;  
    
      var container = new PIXI.Container();
      this.platformLeft = new PIXI.Sprite(circleTexture);
      this.platformRight = new PIXI.Sprite(circleTexture);
      this.platformLine = new PIXI.extras.TilingSprite(lineTexture, 1, 4);
      
      this.platformLine.position.x = this.platformLeft.width - 1;
      this.platformLine.position.y = this.platformLeft.height/2 - this.platformLine.height/2 - 1;
      
      this.platformRight.position.x = this.platformLine.position.x + this.platformLine.width - 2;
      
      container.addChild(this.platformLeft);
      container.addChild(this.platformLine);
      container.addChild(this.platformRight);
      
      container.position.x = Share.get('width')/2 - container.width/2 - this.bridgeWidth/2;
      container.position.y = 270;
      
      return container;
    }
    
    private buildPencil(position): PIXI.Sprite {
      var texture = Share.get('resources')['pencil'].texture;
      var pencil = new PIXI.Sprite(texture);
      
      pencil.pivot.set(pencil.width/2, pencil.height/2)
      
      pencil.position.x = position.x - pencil.width + pencil.width/2 + 20;
      pencil.position.y = position.y + pencil.height/2 + 5;
    
      return pencil;
    }
    
    private buildCharacter(): PIXI.Sprite {
      var youssTexture = Share.get('resources')['youss'].texture;
      var character = new PIXI.Sprite(youssTexture);
      
      character.position.x = 10;
      character.position.y = Share.get('height');
    
      return character;
    } 
    
    private buildDialogue(): PIXI.Graphics {
      var dialMargin = 20;
      var dialX = this.character.width + this.character.position.x - 10;
      var dialWidth = Share.get('width') - dialX - dialMargin;
      dialWidth = Math.min(dialWidth, 300);
      var dialHeight = 100;
      
      var container = new PIXI.Graphics();
      container.beginFill(0x171715);
      container.lineStyle(3, 0x3c3c3b, 1);
      container.drawRoundedRect(0, 0, dialWidth, dialHeight, 5);
      container.endFill();      
      
      container.position.x = dialX;
      container.position.y = Share.get('height') - container.height - 20;
      container.rotation = Util.Math2.degToRad(40);
      container.alpha = 0;
      
      var s = 'Fais peter le score !';
      
      if(this.score) {
        s += '\n' + this.score + ' points ';
      }
      
      var text = new PIXI.Text(s, {
        font: "17px Gobold",
        fill: 0xFFFFFF,
        wordWrap: true,
        wordWrapWidth: dialWidth - 20,
      });
      text.position.set(10, 10);
      container.addChild(text);
      
      return container;
    
  
    }
    
    setScore(score: number): void {
      this.score = score;
    }
    
  }
  
}