
/// <reference path="./core/assets/Font.ts"/>
/// <reference path="./core/assets/Image.ts"/>
/// <reference path="./core/assets/Sound.ts"/>
/// <reference path="./games/pingpong/App.ts"/>

var app = new PingPong.App();
app.getLoaderEntry()
    .add(new Asset.Image('fantouch', 'public/images/fantouch.png'));
    
app.start();
