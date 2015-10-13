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
/// <reference path="./LoaderController.ts"/>
/// <reference path="./ILoadable.ts"/>
/// <reference path="../resources/Share.ts"/>
var Loader = (function () {
    function Loader(controller) {
        this.controller = controller;
        this.assets = new Array();
    }
    Loader.prototype.add = function (asset) {
        this.assets.push(asset);
        this.controller.add(asset.getAlias(), asset.getPath());
        return this;
    };
    Loader.prototype.load = function (cb) {
        this.controller.load(function (loader, resources) {
            var res = Resource.Share.get('resources') || {};
            for (var key in resources) {
                res[key] = resources[key];
            }
            Resource.Share.set('resources', res);
            cb();
        });
    };
    return Loader;
})();
/// <reference path="../loaders/ILoadable.ts"/>
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var Popup;
(function (Popup) {
    var BasePopup = (function () {
        function BasePopup() {
        }
        return BasePopup;
    })();
    Popup.BasePopup = BasePopup;
})(Popup || (Popup = {}));
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
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
            // background: 0xfae337
            background: 0x000000
        };
        return Style;
    })();
    Resource.Style = Style;
})(Resource || (Resource = {}));
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../../typings/greensock/greensock.d.ts"/>
/// <reference path="../resources/Share.ts"/>
/// <reference path="../popups/IPopup.ts"/>
var Scene;
(function (Scene) {
    var CURRENT_SCENE = 'current_scene';
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene(className) {
            _super.call(this);
            this.className = className;
            this.open = false;
            // this.visible = false;
            this.popups = new Array();
            this.onClose = null;
            this.Share = Resource.Share;
            this.stage = this.Share.get('stage');
        }
        /**
         * Attach the scene to the current stage
         */
        BaseScene.prototype.start = function () {
            if (this.open) {
                return;
            }
            var currentScene = this.Share.get(CURRENT_SCENE);
            if (currentScene) {
                currentScene.close();
            }
            this.Share.set(CURRENT_SCENE, this);
            this.open = true;
            this.create();
            this.stage.addChild(this);
            this.animOpen();
            this.logic();
        };
        BaseScene.prototype.animOpen = function () {
            this.layerMask = new PIXI.Graphics();
            this.layerMask.beginFill(0x000000)
                .drawRect(0, 0, this.Share.get('width'), this.Share.get('height'))
                .endFill();
            this.addChild(this.layerMask);
            TweenLite.to(this.layerMask, 0.7, { alpha: 0 });
        };
        /**
         * Close the scene
         */
        BaseScene.prototype.close = function () {
            if (!this.open) {
                return;
            }
            this.removeAllPopup();
            this.Share.set(CURRENT_SCENE, null);
            this.open = false;
            this.clean();
            if (this.onClose) {
                this.onClose();
            }
        };
        /**
         * Restart the scene
         */
        BaseScene.prototype.restart = function () {
            var restartScene = new Scene[this.className]();
            restartScene.start();
        };
        /**
         * Attach a popup to the scene
         */
        BaseScene.prototype.addPopup = function (popup) {
            this.popups.push(popup);
            this.stage.addChild(popup);
        };
        /**
         * Destroy every popup from the scene
         */
        BaseScene.prototype.removeAllPopup = function () {
            var _this = this;
            this.popups.forEach(function (popup) {
                _this.stage.removeChild(popup);
            });
            this.popups.length = 0;
        };
        /**
         * Remove a specific popup
         */
        BaseScene.prototype.removePopup = function (popup) {
            var index = this.popups.indexOf(popup);
            if (index == -1) {
                return;
            }
            this.popups.splice(index, 1);
        };
        BaseScene.prototype.clean = function () {
            this.stage.removeChild(this);
        };
        return BaseScene;
    })(PIXI.Container);
    Scene.BaseScene = BaseScene;
})(Scene || (Scene = {}));
/// <reference path="./BaseScene.ts"/>
var Scene;
(function (Scene) {
    var SplashScene = (function (_super) {
        __extends(SplashScene, _super);
        function SplashScene(color) {
            _super.call(this, 'SplashScene');
            this.color = color || 0x048cff;
        }
        SplashScene.prototype.create = function () {
            var graph = new PIXI.Graphics();
            graph.beginFill(this.color);
            graph.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
            graph.endFill();
            this.addChild(graph);
            var logoTexture = this.Share.get('resources')['fantouch'].texture;
            var logo = new PIXI.Sprite(logoTexture);
            logo.scale.set(0.8, 0.8);
            logo.anchor.set(0.5, 0.5);
            logo.position.set(this.Share.get('width') / 2, this.Share.get('height') / 2);
            this.addChild(logo);
        };
        SplashScene.prototype.logic = function () {
            // setTimeout(() => {
            //   this.close();  
            // }, 3000)
        };
        SplashScene.prototype.start = function () {
            this.startAt = Date.now();
            _super.prototype.start.call(this);
        };
        SplashScene.prototype.close = function () {
            var dt = Date.now() - this.startAt;
            if (dt > SplashScene.MIN_DISPLAY) {
                _super.prototype.close.call(this);
            }
            else {
                setTimeout(this.close.bind(this), dt);
            }
        };
        SplashScene.MIN_DISPLAY = 1000;
        return SplashScene;
    })(Scene.BaseScene);
    Scene.SplashScene = SplashScene;
})(Scene || (Scene = {}));
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
var PingPong;
(function (PingPong) {
    var Viewport = (function () {
        function Viewport() {
        }
        return Viewport;
    })();
    PingPong.Viewport = Viewport;
})(PingPong || (PingPong = {}));
/// <reference path="./Viewport.ts"/>
/// <reference path="../../core/scenes/BaseScene.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
var PingPong;
(function (PingPong) {
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene(world) {
            _super.call(this, 'GameScene');
            this.world = world;
            this.viewport = new PingPong.Viewport();
        }
        GameScene.prototype.create = function () {
            var bg = new PIXI.Graphics();
            bg.beginFill(0xfae337);
            bg.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
            bg.endFill();
            this.addChild(bg);
        };
        GameScene.prototype.logic = function () {
            console.log('GameScene :)');
        };
        return GameScene;
    })(Scene.BaseScene);
    PingPong.GameScene = GameScene;
})(PingPong || (PingPong = {}));
/// <reference path="./loaders/Loader.ts"/>
var BaseApp = (function () {
    function BaseApp() {
        this.loaderEntry = new Loader(PIXI.loader);
        this.loaderGame = new Loader(PIXI.loader);
    }
    /**
     * Return the loader app (logo, youssoupha, ...)
     */
    BaseApp.prototype.getLoaderEntry = function () {
        return this.loaderEntry;
    };
    /**
     * Return the loader game (sound, assets, ...)
     */
    BaseApp.prototype.getLoaderGame = function () {
        return this.loaderGame;
    };
    return BaseApp;
})();
/// <reference path="./Config.ts"/>
/// <reference path="./GameScene.ts"/>
/// <reference path="../../core/scenes/SplashScene.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="../../core/BaseApp.ts"/>
/// <reference path="../../core/assets/Font.ts"/>
/// <reference path="../../core/assets/Image.ts"/>
/// <reference path="../../core/assets/Sound.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
var PingPong;
(function (PingPong) {
    var Style = Resource.Style;
    var Share = Resource.Share;
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            _super.call(this);
            console.log('init ping pong game');
            // Create a world
            Physics({}, this.onWorldReady.bind(this));
        }
        /**
         * World configuration
         */
        App.prototype.onWorldReady = function (world) {
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
            Share.set('width', this.renderer.width);
            Share.set('height', this.renderer.height);
            Share.set('renderer', this.renderer);
            Share.set('stage', this.renderer.stage);
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
            this.world.on('step', function () {
                _this.world.render();
            });
        };
        App.prototype.start = function () {
            var _this = this;
            console.log('app start todo');
            var gameScene = new PingPong.GameScene(this.world);
            var splashScene = new Scene.SplashScene();
            splashScene.onClose = function () {
                gameScene.start();
            };
            // Load the app asset
            this.loaderEntry.load(function () {
                console.log('loader entry complete');
                splashScene.start();
                // Load the game asset
                _this.loaderGame
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
                    .add(new Asset.Image('sep', 'public/images/sep.png'));
                _this.loaderGame.load(function () {
                    console.log('loader game complete');
                    splashScene.close();
                });
            });
        };
        return App;
    })(BaseApp);
    PingPong.App = App;
})(PingPong || (PingPong = {}));
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
/// <reference path="./core/assets/Font.ts"/>
/// <reference path="./core/assets/Image.ts"/>
/// <reference path="./core/assets/Sound.ts"/>
/// <reference path="./games/pingpong/App.ts"/>
var app = new PingPong.App();
app.getLoaderEntry()
    .add(new Asset.Image('fantouch', 'public/images/fantouch.png'));
app.start();
