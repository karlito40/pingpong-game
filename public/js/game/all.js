var GameBase = (function () {
    function GameBase() {
    }
    return GameBase;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../GameBase.ts"/>
var PingPong;
(function (PingPong) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
            console.log('init ping pong game');
        }
        return Game;
    })(GameBase);
    PingPong.Game = Game;
})(PingPong || (PingPong = {}));
/// <reference path="../loaders/Loadable.ts"/>
var Asset;
(function (Asset) {
    var AssetBase = (function () {
        function AssetBase(alias, path, type) {
            this.alias = alias;
            this.path = path;
            this.type = type;
        }
        AssetBase.prototype.getAlias = function () {
            return this.alias;
        };
        AssetBase.prototype.getPath = function () {
            return this.path;
        };
        AssetBase.prototype.getType = function () {
            return this.type;
        };
        AssetBase.prototype.setPath = function (path) {
            this.path = path;
            return this;
        };
        AssetBase.prototype.setAlias = function (alias) {
            this.alias = alias;
            return this;
        };
        return AssetBase;
    })();
    Asset.AssetBase = AssetBase;
})(Asset || (Asset = {}));
var Asset;
(function (Asset) {
    (function (Type) {
        Type[Type["IMAGE"] = 0] = "IMAGE";
        Type[Type["SOUND"] = 1] = "SOUND";
        Type[Type["FONT"] = 2] = "FONT";
    })(Asset.Type || (Asset.Type = {}));
    var Type = Asset.Type;
    ;
})(Asset || (Asset = {}));
/// <reference path="./AssetBase.ts"/>
/// <reference path="./Type.ts"/>
var Asset;
(function (Asset) {
    var Font = (function (_super) {
        __extends(Font, _super);
        function Font(alias, path) {
            _super.call(this, alias, path, Asset.Type.FONT);
        }
        return Font;
    })(Asset.AssetBase);
    Asset.Font = Font;
})(Asset || (Asset = {}));
/// <reference path="./AssetBase.ts"/>
/// <reference path="./Type.ts"/>
var Asset;
(function (Asset) {
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image(alias, path) {
            _super.call(this, alias, path, Asset.Type.IMAGE);
        }
        return Image;
    })(Asset.AssetBase);
    Asset.Image = Image;
})(Asset || (Asset = {}));
/// <reference path="./AssetBase.ts"/>
/// <reference path="./Type.ts"/>
var Asset;
(function (Asset) {
    var Sound = (function (_super) {
        __extends(Sound, _super);
        function Sound(alias, path) {
            _super.call(this, alias, path, Asset.Type.SOUND);
        }
        return Sound;
    })(Asset.AssetBase);
    Asset.Sound = Sound;
})(Asset || (Asset = {}));
/// <reference path="./LoaderController.ts"/>
var Loader = (function () {
    function Loader(controller) {
        this.controller = controller;
        this.assets = new Array();
    }
    Loader.prototype.add = function (asset) {
        this.assets.push(asset);
        if (this.controller) {
            this.controller.add(asset.getAlias(), asset.getPath());
        }
        return this;
    };
    Loader.prototype.load = function (cb) {
        if (this.controller) {
            this.controller.load(cb);
        }
    };
    return Loader;
})();
var Lyric = {
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
};
var Resource;
(function (Resource) {
    var Share = (function () {
        function Share() {
        }
        Share.set = function (key, value) {
            Share.registre[key] = value;
            return this;
        };
        Share.delete = function (key) {
            delete Share.registre[key];
            return this;
        };
        Share.get = function (key) {
            return Share.registre[key];
        };
        Share.registre = {};
        return Share;
    })();
    Resource.Share = Share;
})(Resource || (Resource = {}));
// var Resource = Resource || {};
// (function(exports) {
//   exports.Style = {
//     circle: {
//       strokeStyle: 0xcb4b16,
//       lineWidth: 1,
//       fillStyle: 'transparent'  
//     },
//     line: {
//       strokeStyle: 0x3e5060,
//       lineWidth: 4
//     },
//     font: {
//       font: '30px OogieBoogie',
//       fill: 0xFFFFFF
//     },
//     background: 0xfae337
//   };
// })(Resource); 
/// <reference path="../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="./loaders/Loader.ts"/>
/// <reference path="./assets/Font.ts"/>
/// <reference path="./assets/Image.ts"/>
/// <reference path="./assets/Sound.ts"/>
/// <reference path="./resources/Share.ts"/>
/// <reference path="./games/pingpong/Game.ts"/>
var loader = new Loader(PIXI.loader);
// Things relate to our app
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
    .load(function (loader, resources) {
    Share.set('resources', resources);
    // Things relate to the game
    var game = new PingPong.Game();
});
