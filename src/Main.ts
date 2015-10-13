/// <reference path="../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="./loaders/Loader.ts"/>
/// <reference path="./assets/Font.ts"/>
/// <reference path="./assets/Image.ts"/>
/// <reference path="./assets/Sound.ts"/>
/// <reference path="./resources/Share.ts"/>
/// <reference path="./games/pingpong/Game.ts"/>


var loader = new Loader(PIXI.loader);

// Things relate to the app
loader
  .add(new Asset.Font('OogieBoogie', 'public/fonts/OogieBoogie/OogieBoogie.fnt'))
  .add(new Asset.Font('OogieBoogieMin', 'public/fonts/OogieBoogie/OogieBoogieMin.fnt'))
  .add(new Asset.Image('youssy-ball', 'public/images/youssy-ball.png'))
  .add(new Asset.Image('bg-cloud', 'public/images/bg-cloud.png'))
  .add(new Asset.Image('bg-record', 'public/images/bg-record.png'))
  .add(new Asset.Image('bg-party', 'public/images/bg-party.png'))
  .add(new Asset.Image('pencil', 'public/images/pencil.png'))
  .add(new Asset.Image('line', 'public/images/line.png'))
  .add(new Asset.Image('circle', 'public/images/circle.png'))
  .add(new Asset.Image('youss', 'public/images/youss.png'))
  .add(new Asset.Image('sep', 'public/images/sep.png'))
  
  .load((loader, resources) => {
    
    Resource.Share.set('resources', resources);

    // Things relate to the game
    var game = new PingPong.Game();
    
  });

  

