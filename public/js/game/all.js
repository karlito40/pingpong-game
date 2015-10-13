var PingPong;
(function (PingPong) {
    var Config = (function () {
        function Config() {
        }
        Config.DEBUG = false;
        Config.FIREWORK_ON_STEP = false;
        Config.FIREWORK_ON_RECORD = false;
        Config.STEP_THEME = false;
        Config.RAINBOW_STEP = 10;
        Config.ALPHA_TUTO = 0.25;
        Config.TRAIL_PARTICLE_DELAY = 70;
        Config.GRAVITY = 0.002;
        Config.JUMP_BY = -0.7;
        Config.GARBAGE_DELAY = 2000;
        Config.STEP_ALTITUDE = 1000;
        Config.TOP_LIMIT = -500;
        Config.GARBAGE_TYPE = ['trampoline', 'particle'];
        Config.PLATFORM_TUTO = 'tuto';
        Config.SCROLL_SPEED = 5;
        Config.PLATFORM_SPEED = 5 / 10;
        return Config;
    })();
    PingPong.Config = Config;
})(PingPong || (PingPong = {}));
var GameBase = (function () {
    function GameBase() {
    }
    return GameBase;
})();
var Resource;
(function (Resource) {
    var Style = (function () {
        function Style() {
        }
        Style.get = function (key) {
            return Style.config[key];
        };
        Style.config = {
            circle: {
                strokeStyle: 0xcb4b16,
                lineWidth: 1,
                fillStyle: 'transparent'
            },
            line: {
                strokeStyle: 0x3e5060,
                lineWidth: 4
            },
            font: {
                font: '30px OogieBoogie',
                fill: 0xFFFFFF
            },
            background: 0xfae337
        };
        return Style;
    })();
    Resource.Style = Style;
})(Resource || (Resource = {}));
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./Config.ts"/>
/// <reference path="../GameBase.ts"/>
/// <reference path="../../resources/Style.ts"/>
/// <reference path="../../resources/Share.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
var PingPong;
(function (PingPong) {
    var Style = Resource.Style;
    var Share = Resource.Share;
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
            console.log('init ping pong game');
            Physics({}, this.onWorldReady.bind(this));
        }
        /**
         * World configuration
         */
        Game.prototype.onWorldReady = function (world) {
            var _this = this;
            this.world = world;
            this.renderer = Physics.renderer('pixi', {
                el: 'viewport',
                meta: PingPong.Config.DEBUG,
                autoResize: true,
                styles: {
                    'color': Style.get('background'),
                    'circle': Style.get('circle'),
                    'rectangle': Style.get('line')
                }
            });
            var gravity = Physics.behavior('constant-acceleration', {
                acc: { x: 0, y: PingPong.Config.GRAVITY }
            });
            this.world.add([
                this.renderer,
                gravity,
                Physics.behavior('body-impulse-response'),
                Physics.behavior('body-collision-detection'),
                Physics.behavior('sweep-prune')
            ]);
            Physics.util.ticker.on(function (time, dt) {
                Share.set('dt', dt);
                _this.world.step(time);
            });
            Share.set('width', this.renderer.width);
            Share.set('height', this.renderer.height);
            Share.set('renderer', this.renderer);
            Share.set('stage', this.renderer.stage);
            Share.set('world_manager', this);
        };
        return Game;
    })(GameBase);
    PingPong.Game = Game;
})(PingPong || (PingPong = {}));
/// <reference path="../loaders/Loadable.ts"/>
var Asset;
(function (Asset) {
    var BaseAsset = (function () {
        function BaseAsset(alias, path, type) {
            this.alias = alias;
            this.path = path;
            this.type = type;
        }
        BaseAsset.prototype.getAlias = function () {
            return this.alias;
        };
        BaseAsset.prototype.getPath = function () {
            return this.path;
        };
        BaseAsset.prototype.getType = function () {
            return this.type;
        };
        BaseAsset.prototype.setPath = function (path) {
            this.path = path;
            return this;
        };
        BaseAsset.prototype.setAlias = function (alias) {
            this.alias = alias;
            return this;
        };
        return BaseAsset;
    })();
    Asset.BaseAsset = BaseAsset;
})(Asset || (Asset = {}));
var Asset;
(function (Asset) {
    ;
})(Asset || (Asset = {}));
/// <reference path="./BaseAsset.ts"/>
/// <reference path="./Type.ts"/>
var Asset;
(function (Asset) {
    var Font = (function (_super) {
        __extends(Font, _super);
        function Font(alias, path) {
            _super.call(this, alias, path, 2 /* FONT */);
        }
        return Font;
    })(Asset.BaseAsset);
    Asset.Font = Font;
})(Asset || (Asset = {}));
/// <reference path="./BaseAsset.ts"/>
/// <reference path="./Type.ts"/>
var Asset;
(function (Asset) {
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image(alias, path) {
            _super.call(this, alias, path, 0 /* IMAGE */);
        }
        return Image;
    })(Asset.BaseAsset);
    Asset.Image = Image;
})(Asset || (Asset = {}));
/// <reference path="./BaseAsset.ts"/>
/// <reference path="./Type.ts"/>
var Asset;
(function (Asset) {
    var Sound = (function (_super) {
        __extends(Sound, _super);
        function Sound(alias, path) {
            _super.call(this, alias, path, 1 /* SOUND */);
        }
        return Sound;
    })(Asset.BaseAsset);
    Asset.Sound = Sound;
})(Asset || (Asset = {}));
/// <reference path="./LoaderController.ts"/>
/// <reference path="./Loadable.ts"/>
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
var Resource;
(function (Resource) {
    var Lyric = (function () {
        function Lyric() {
        }
        Lyric.get = function (key) {
            return Lyric.get(key);
        };
        Lyric.config = {
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
        return Lyric;
    })();
    Resource.Lyric = Lyric;
})(Resource || (Resource = {}));
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
    .load(function (loader, resources) {
    Resource.Share.set('resources', resources);
    // Things relate to the game
    var game = new PingPong.Game();
});
