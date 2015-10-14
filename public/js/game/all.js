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
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
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
        BaseScene.getCurrent = function () {
            return Resource.Share.get(CURRENT_SCENE);
        };
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
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../resources/Share.ts"/>
/// <reference path="../scenes/BaseScene.ts"/>
/// <reference path="./IPopup.ts"/>
/// <reference path="../../../typings/greensock/greensock.d.ts"/>
var Popup;
(function (Popup) {
    var Share = Resource.Share;
    var BasePopup = (function (_super) {
        __extends(BasePopup, _super);
        function BasePopup() {
            _super.call(this);
            this.filterAlpha = 0.3;
            this.openState = false;
            this.onClose = null;
        }
        BasePopup.prototype.open = function () {
            BasePopup.current = this;
            this.openState = true;
            this.alpha = 0;
            this.addFilter();
            this.create();
            Scene.BaseScene
                .getCurrent()
                .addPopup(this);
            TweenLite.to(this, 0.5, { alpha: 1 });
        };
        BasePopup.prototype.addFilter = function () {
            this.filter = new PIXI.Graphics();
            this.filter.beginFill(0x000000)
                .drawRect(0, 0, Share.get('width'), Share.get('height'))
                .endFill();
            this.filter.alpha = this.filterAlpha;
            this.addChild(this.filter);
        };
        BasePopup.prototype.close = function () {
            var _this = this;
            if (!this.openState) {
                return;
            }
            BasePopup.current = null;
            this.openState = false;
            if (this.onClose) {
                this.onClose();
            }
            TweenMax.to(this, 0.3, { alpha: 0, onComplete: function () {
                    Scene.BaseScene
                        .getCurrent()
                        .removePopup(_this);
                } });
        };
        BasePopup.current = null;
        BasePopup.id = 0;
        return BasePopup;
    })(PIXI.Container);
    Popup.BasePopup = BasePopup;
})(Popup || (Popup = {}));
var Resource;
(function (Resource) {
    var SystemStorage = (function () {
        function SystemStorage() {
        }
        SystemStorage.getItem = function (key) {
            if (localStorage) {
                SystemStorage._map[key] = localStorage.getItem(key);
            }
            return SystemStorage._map[key];
        };
        SystemStorage.setItem = function (key, value) {
            SystemStorage._map[key] = value;
            if (localStorage) {
                localStorage.setItem(key, value);
            }
        };
        SystemStorage._map = {};
        return SystemStorage;
    })();
    var Storage = (function () {
        function Storage() {
        }
        Storage.get = function (key) {
            var val = SystemStorage.getItem(key);
            var o = JSON.parse(val);
            if (o && o._lonely) {
                return o._lonely;
            }
            return o;
        };
        Storage.set = function (key, value) {
            if (typeof value != 'object') {
                value = { _lonely: value };
            }
            value = JSON.stringify(value);
            return SystemStorage.setItem(key, value);
        };
        return Storage;
    })();
    Resource.Storage = Storage;
})(Resource || (Resource = {}));
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
var Util;
(function (Util) {
    var Color = (function () {
        function Color() {
        }
        Color.componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        Color.rgbToHax = function (rgb) {
            var rgbList = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "0x" +
                Color.componentToHex(parseInt(rgbList[1]))
                + Color.componentToHex(parseInt(rgbList[2]))
                + Color.componentToHex(parseInt(rgbList[3]));
        };
        Color.hexaToColor = function (hexa) {
            return '#' + hexa.toString().slice(2);
        };
        Color.colorToHexa = function (color) {
            return '0x' + color.toString().slice(1);
        };
        return Color;
    })();
    Util.Color = Color;
})(Util || (Util = {}));
var Util;
(function (Util) {
    var Math2 = (function () {
        function Math2() {
        }
        /**
         * Convert a degree to a radian
         */
        Math2.degToRad = function (deg) {
            return deg * Math2.DEG_TO_RAD;
        };
        Math2.DEG_TO_RAD = 0.017453292519943295;
        return Math2;
    })();
    Util.Math2 = Math2;
})(Util || (Util = {}));
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
        Config.PLATFORM_SPEED = 0.5;
        return Config;
    })();
    PingPong.Config = Config;
})(PingPong || (PingPong = {}));
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="./Config.ts"/>
var PingPong;
(function (PingPong) {
    var ALTITUDE_PADDING = 10;
    var Viewport = (function (_super) {
        __extends(Viewport, _super);
        function Viewport() {
            _super.call(this);
            this.widthScene = Resource.Share.get('width');
            this.heightScene = Resource.Share.get('height');
            this.active = false;
            this.altitude = 0;
            this.create();
        }
        Viewport.prototype.start = function () {
            this.active = true;
            this.altitude = 0;
            this.score = 0;
        };
        Viewport.prototype.stop = function () {
            this.active = false;
            this.score = this.altitude;
        };
        Viewport.prototype.create = function () {
            // Background
            var cloudTexture = Resource.Share.get('resources')['bg-cloud'].texture;
            this.bg = new PIXI.extras.TilingSprite(cloudTexture, 1192, 800);
            this.addChild(this.bg);
            // Altitude Bitmap
            this.altitudeText = new PIXI.extras.BitmapText('', { font: "30px OogieBoogie" });
            this.replaceAltitudeText();
            this.addChild(this.altitudeText);
        };
        Viewport.prototype.update = function () {
            this.setY(this.bg.tilePosition.y + PingPong.Config.SCROLL_SPEED);
            if (this.active) {
                this.altitude += PingPong.Config.SCROLL_SPEED;
                this.replaceAltitudeText();
            }
        };
        Viewport.prototype.replaceAltitudeText = function () {
            this.altitudeText.text = this.altitude + ' m';
            this.altitudeText.position.x = this.widthScene - ALTITUDE_PADDING - this.altitudeText.width;
            this.altitudeText.position.y = ALTITUDE_PADDING;
        };
        Viewport.prototype.setY = function (y) {
            this.bg.tilePosition.y = y;
        };
        Viewport.prototype.getAltitude = function () {
            return this.altitude;
        };
        Viewport.prototype.getScore = function () {
            return this.score;
        };
        return Viewport;
    })(PIXI.Container);
    PingPong.Viewport = Viewport;
})(PingPong || (PingPong = {}));
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="./Config.ts"/>
var PingPong;
(function (PingPong) {
    var Style = Resource.Style;
    var Share = Resource.Share;
    var Physic = (function () {
        function Physic() {
            this.updates = [];
            Physics({}, this.onWorldReady.bind(this));
        }
        Physic.prototype.onWorldReady = function (world) {
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
                Physics.behavior('sweep-prune'),
                Physics.behavior('interactive', { el: this.renderer.el })
                    .applyTo(world.find({ name: 'box' }))
            ]);
            Physics.util.ticker.on(function (time, dt) {
                Share.set('dt', dt);
                _this.world.step(time);
            });
            this.world.on('step', function () {
                _this.world.render();
                _this.updates.forEach(function (cb) {
                    cb();
                });
            });
            this.garbage();
        };
        Physic.prototype.addEvents = function (events) {
            var _this = this;
            events.forEach(function (event) {
                for (var key in event) {
                    _this.world.on(key, event[key]);
                }
            });
        };
        Physic.prototype.garbage = function () {
            var _this = this;
            var bodies = this.world.getBodies();
            bodies.forEach(function (body) {
                if (body.className
                    && PingPong.Config.GARBAGE_TYPE.indexOf(body.className) != -1
                    && body.state.pos.y > _this.renderer.height) {
                    _this.world.remove(body);
                }
            });
            setTimeout(this.garbage.bind(this), PingPong.Config.GARBAGE_DELAY);
        };
        Physic.prototype.addUpdate = function (cb) {
            this.updates.push(cb);
        };
        Physic.prototype.addBody = function (objects) {
            var _this = this;
            if (Array.isArray(objects)) {
                objects.forEach(function (object) {
                    _this.world.add(object);
                });
            }
            else {
                this.world.add(objects);
            }
        };
        Physic.prototype.removeBody = function (object) {
            this.world.remove(object);
        };
        Physic.prototype.getWorld = function () {
            return this.world;
        };
        return Physic;
    })();
    PingPong.Physic = Physic;
})(PingPong || (PingPong = {}));
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="./Config.ts"/>  
/// <reference path="./Physic.ts"/>  
var PingPong;
(function (PingPong) {
    var Share = Resource.Share;
    var Ball = (function () {
        function Ball(physic) {
            this.active = false;
            this.physic = physic;
            this.onLost = null;
            this.body = Physics.body('circle', {
                radius: 25,
                x: Share.get('width') / 2,
                y: 210,
                restitution: 1,
                cof: 1,
                mass: 1000,
                angle: 0,
                treatment: 'static'
            });
            this.idName = 'ball';
            this.body.idName = this.idName;
            var ballTexture = Share.get('resources')['youssy-ball'].texture;
            this.body.view = Share.get('renderer').createDisplay('sprite', {
                texture: ballTexture,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            });
            this.physic.addEvents([
                this.getPhysicsEvents()
            ]);
            this.stop();
        }
        Ball.prototype.update = function () {
            if (this.active
                && (this.body.state.pos.y < PingPong.Config.TOP_LIMIT
                    || this.body.state.pos.y > Share.get('height'))) {
                if (this.onLost) {
                    this.onLost();
                }
            }
        };
        Ball.prototype.start = function () {
            this.active = true;
            // this.body.view.scale.set(1, 1);
            this.body.treatment = 'dynamic';
        };
        Ball.prototype.stop = function () {
            this.active = false;
            // this.body.view.scale.set(1, 1);
            this.body.treatment = 'static';
            this.body.state.pos.x = Share.get('width') / 2;
            this.body.state.pos.y = 210;
            if (!this.staticAnim) {
                this.staticAnim = new TimelineMax({ yoyo: true, repeat: -1 });
                this.staticAnim.to(this.body.view.scale, 0.2, { x: 0.8, y: 0.9 });
            }
        };
        Ball.prototype.onCollision = function (data) {
            var self = this;
            var colliders = data.collisions;
            var isBumpAllowed = false;
            for (var i in colliders) {
                var collider = colliders[i], bodyA = collider.bodyA, bodyB = collider.bodyB, platformCollider = null, ballCollider = null;
                if (bodyA.idName == self.idName) {
                    ballCollider = bodyA;
                    platformCollider = bodyB;
                }
                else if (bodyB.idName == self.idName) {
                    ballCollider = bodyB;
                    platformCollider = bodyA;
                }
                if (ballCollider
                    && ballCollider.state.pos.y < platformCollider.state.pos.y) {
                    isBumpAllowed = true;
                    break;
                }
            }
            if (isBumpAllowed) {
                // Force vy to be exactly the same no matter what
                var vxBall = this.body.state.vel.x;
                this.body.state.vel.set(vxBall, PingPong.Config.JUMP_BY);
                // this.nextLyric();
                if (this.onBump) {
                    this.onBump(this.body.state.pos);
                }
            }
            if (platformCollider) {
                platformCollider.platform.fall();
            }
        };
        Ball.prototype.getPhysicsEvents = function () {
            return {
                'collisions:detected': this.onCollision.bind(this)
            };
        };
        Ball.prototype.getBody = function () {
            return this.body;
        };
        return Ball;
    })();
    PingPong.Ball = Ball;
})(PingPong || (PingPong = {}));
/// <reference path="../../core/resources/Share.ts"/>
var PingPong;
(function (PingPong) {
    var Share = Resource.Share;
    var Lyric = (function () {
        function Lyric() {
            var artistMap = Lyric.config[~~(Math.random() * Lyric.config.length)];
            var songs = artistMap.songs;
            this.song = songs[~~(Math.random() * songs.length)];
            this.line = 0;
        }
        Lyric.prototype.next = function (position) {
            var now = Date.now();
            if (this.lastCollisionTime
                && now - this.lastCollisionTime < 25) {
                return;
            }
            this.lastCollisionTime = now;
            if (!this.line || !this.song.lines[this.line]) {
                this.line = 0;
            }
            var widthScene = Share.get('width');
            var onomatope = this.song.lines[this.line];
            var text = new PIXI.extras.BitmapText(onomatope, {
                font: "30px OogieBoogie"
            });
            text.position.y = position.y - 30;
            text.position.x = position.x + 30;
            var xEnd = text.position.x + text.width;
            if (xEnd > widthScene) {
                var diff = xEnd - widthScene;
                text.position.x -= diff + 40;
                if (text.position.x < 0) {
                    text.position.x = 20;
                    text.scale.set(0.8, 0.8);
                }
                text.position.y += 40;
            }
            var stage = Share.get('stage');
            stage.addChild(text);
            TweenMax.to(text.position, 0.5, { y: '-=50', onComplete: function () {
                    stage.removeChild(text);
                } });
            this.line++;
        };
        Lyric.config = [{
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
        return Lyric;
    })();
    PingPong.Lyric = Lyric;
})(PingPong || (PingPong = {}));
var PingPong;
(function (PingPong) {
    var Constant = (function () {
        function Constant() {
        }
        Constant.NB_GAME = 'nb_game';
        Constant.RECORD = 'record';
        return Constant;
    })();
    PingPong.Constant = Constant;
})(PingPong || (PingPong = {}));
/// <reference path="../../core/popups/BasePopup.ts"/>
/// <reference path="../../core/utils/Math2.ts"/>
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
/// <reference path="./Constant.ts"/>
var PingPong;
(function (PingPong) {
    var Share = Resource.Share;
    var Storage = Resource.Storage;
    var StarterPopup = (function (_super) {
        __extends(StarterPopup, _super);
        function StarterPopup() {
            _super.call(this);
            this.bridgeWidth = 150;
            this.tlTuto = null;
            this.tlPlatform = null;
            this.nbGame = Storage.get(PingPong.Constant.NB_GAME) || 0;
            this.record = Storage.get(PingPong.Constant.RECORD) || 0;
        }
        StarterPopup.prototype.create = function () {
            this.logoContainer = this.buildLogo();
            this.addChild(this.logoContainer);
            this.recordContainer = this.buildRecord();
            this.addChild(this.recordContainer);
            this.nbGameContainer = this.buildNbGame();
            this.addChild(this.nbGameContainer);
            this.platformerContainer = this.buildPlatformer();
            this.addChild(this.platformerContainer);
            this.pencil = this.buildPencil(this.platformerContainer.position);
            this.addChild(this.pencil);
            this.character = this.buildCharacter();
            this.addChild(this.character);
            this.dialogueContainer = this.buildDialogue();
            this.addChild(this.dialogueContainer);
            this.contentAnimation();
        };
        StarterPopup.prototype.close = function () {
            if (!this.openState) {
                return;
            }
            if (this.tlPlatform) {
                this.tlPlatform.clear();
                this.tlPlatform = null;
            }
            if (this.tlTuto) {
                this.tlTuto.clear();
                this.tlTuto = null;
            }
            var tl = new TimelineMax();
            tl.to(this.logoContainer.position, 0.3, { y: -300 }, 'start');
            tl.to(this.platformerContainer, 0.15, { alpha: 0 }, 'start');
            tl.to([
                this.recordContainer.position,
                this.nbGameContainer.position
            ], 0.3, { x: -100 }, 'start');
            tl.to([
                this.character.position,
                this.dialogueContainer.position
            ], 0.3, { y: '+=' + this.character.height }, 'start');
            _super.prototype.close.call(this);
        };
        StarterPopup.prototype.contentAnimation = function () {
            this.tlTuto = new TimelineMax();
            this.tlTuto.to(this.character.position, 0.2, { y: '-=' + this.character.height });
            this.tlTuto.to(this.dialogueContainer, 0.1, { alpha: 1 }, '-=0.1');
            this.tlTuto.to(this.dialogueContainer.position, 0.2, { y: '-=50' }, '-=0.15');
            this.tlTuto.to(this.dialogueContainer, 1, { rotation: 0, ease: Elastic.easeOut }, '-=0.2');
            var bridgeDuration = 0.7;
            var pencilDestX = this.bridgeWidth + this.pencil.width / 2 + 13;
            this.tlPlatform = new TimelineMax({ repeat: -1, repeatDelay: 0.5 });
            this.tlPlatform.to(this.platformLine, bridgeDuration, { width: this.bridgeWidth }, 'start');
            this.tlPlatform.to(this.platformRight.position, bridgeDuration, { x: '+=' + this.bridgeWidth }, 'start');
            this.tlPlatform.to(this.pencil.position, bridgeDuration, { y: '+=3', x: '+=' + pencilDestX }, 'start');
            this.tlPlatform.to(this.pencil, bridgeDuration, { rotation: Util.Math2.degToRad(-70) }, 'start');
        };
        /**
         * Construct the logo container
         */
        StarterPopup.prototype.buildLogo = function () {
            var container = new PIXI.Container();
            var youssyText = new PIXI.extras.BitmapText("Youssy", { font: "60px OogieBoogie" });
            youssyText.position.x = Share.get('width') / 2 - youssyText.width / 2;
            var ballText = new PIXI.extras.BitmapText("Ball", { font: "60px OogieBoogie" });
            ballText.position.x = Share.get('width') / 2 - ballText.width / 2;
            ballText.position.y = 45;
            container.addChild(youssyText);
            container.addChild(ballText);
            container.position.y = 60;
            return container;
        };
        /**
         * Construct the record container
         */
        StarterPopup.prototype.buildRecord = function () {
            var ballTexture = Share.get('resources')['youssy-ball'].texture;
            var container = new PIXI.Container();
            container.position.y = 15;
            var recordBgTexture = Share.get('resources')['bg-record'].texture;
            var recordBg = new PIXI.extras.TilingSprite(recordBgTexture, 80, 23);
            container.addChild(recordBg);
            var recordText = new PIXI.extras.BitmapText(this.record.toString(), {
                font: "15px OogieBoogieMin"
            });
            recordText.position.x = container.width - recordText.width - 25;
            container.addChild(recordText);
            var recordIco = new PIXI.Sprite(ballTexture);
            recordIco.scale.set(0.6);
            recordIco.position.y = -5;
            recordIco.position.x = container.width - 20;
            container.addChild(recordIco);
            return container;
        };
        /**
         * Construct the nb game play container
         */
        StarterPopup.prototype.buildNbGame = function () {
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
        };
        /**
         * Build the platformer tutorial
         */
        StarterPopup.prototype.buildPlatformer = function () {
            var circleTexture = Share.get('resources').circle.texture;
            var lineTexture = Share.get('resources').line.texture;
            var container = new PIXI.Container();
            this.platformLeft = new PIXI.Sprite(circleTexture);
            this.platformRight = new PIXI.Sprite(circleTexture);
            this.platformLine = new PIXI.extras.TilingSprite(lineTexture, 1, 4);
            this.platformLine.position.x = this.platformLeft.width - 1;
            this.platformLine.position.y = this.platformLeft.height / 2 - this.platformLine.height / 2 - 1;
            this.platformRight.position.x = this.platformLine.position.x + this.platformLine.width - 2;
            container.addChild(this.platformLeft);
            container.addChild(this.platformLine);
            container.addChild(this.platformRight);
            container.position.x = Share.get('width') / 2 - container.width / 2 - this.bridgeWidth / 2;
            container.position.y = 270;
            return container;
        };
        StarterPopup.prototype.buildPencil = function (position) {
            var texture = Share.get('resources')['pencil'].texture;
            var pencil = new PIXI.Sprite(texture);
            pencil.pivot.set(pencil.width / 2, pencil.height / 2);
            pencil.position.x = position.x - pencil.width + pencil.width / 2 + 20;
            pencil.position.y = position.y + pencil.height / 2 + 5;
            return pencil;
        };
        StarterPopup.prototype.buildCharacter = function () {
            var youssTexture = Share.get('resources')['youss'].texture;
            var character = new PIXI.Sprite(youssTexture);
            character.position.x = 10;
            character.position.y = Share.get('height');
            return character;
        };
        StarterPopup.prototype.buildDialogue = function () {
            var dialMargin = 20;
            var dialX = this.character.width + this.character.position.x - 10;
            var dialWidth = Share.get('width') - dialX - dialMargin;
            dialWidth = Math.min(dialWidth, 300);
            var dialHeight = 100;
            var container = new PIXI.Graphics();
            container.beginFill(0xFFFFFF);
            container.lineStyle(3, 0x000000, 1);
            container.drawRoundedRect(0, 0, dialWidth, dialHeight, 5);
            container.endFill();
            container.position.x = dialX;
            container.position.y = Share.get('height') - this.character.height + 70;
            container.rotation = Util.Math2.degToRad(40);
            container.alpha = 0;
            var s = 'Reach the sky';
            var text = new PIXI.Text(s, {
                font: "17px Arial",
                wordWrap: true,
                wordWrapWidth: dialWidth - 20
            });
            text.position.set(10, 10);
            container.addChild(text);
            return container;
        };
        return StarterPopup;
    })(Popup.BasePopup);
    PingPong.StarterPopup = StarterPopup;
})(PingPong || (PingPong = {}));
/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>
/// <reference path="../../../typings/physicsjs/physicsjs.d.ts"/>
/// <reference path="./IPoint.ts"/>
/// <reference path="./EPlatform.ts"/>
/// <reference path="./Config.ts"/>
/// <reference path="../../core/resources/Share.ts"/>
var PingPong;
(function (PingPong) {
    var Share = Resource.Share;
    var HEIGHT = 4;
    var Platform = (function () {
        function Platform(from, to, type) {
            this.type = type;
            var deltaX = to.x - from.x;
            var deltaY = to.y - from.y;
            var w = Math.abs(deltaX);
            var h = Math.abs(deltaY);
            var width = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
            var angle = Math.atan2(deltaY, deltaX);
            this.body = Physics.body('rectangle', {
                width: width,
                height: HEIGHT,
                x: from.x,
                y: from.y,
                vy: (this.type) ? PingPong.Config.PLATFORM_SPEED : 0,
                cof: 1,
                restitution: 1,
                angle: angle,
                treatment: 'kinematic',
                offset: Physics.vector(width / 2, 0)
            });
            this.body.className = 'trampoline';
            this.body.platform = this;
            var lineTexture = Share.get('resources').line.texture;
            var circleTexture = Share.get('resources').circle.texture;
            var lineContainer = new PIXI.Container();
            var tilingSprite = new PIXI.extras.TilingSprite(lineTexture, width, HEIGHT);
            var leftCircle = new PIXI.Sprite(circleTexture);
            var rightCircle = new PIXI.Sprite(circleTexture);
            leftCircle.anchor.set(0.5, 0.5);
            rightCircle.anchor.set(0.5, 0.5);
            rightCircle.position.x = width;
            tilingSprite.position.y = -2;
            lineContainer.addChild(tilingSprite);
            lineContainer.addChild(leftCircle);
            lineContainer.addChild(rightCircle);
            this.body.view = Share.get('renderer').createDisplay('view', {
                view: lineContainer
            });
        }
        Platform.prototype.fall = function () {
            this.setType(1 /* FALL */);
        };
        Platform.prototype.setType = function (type) {
            if (this.type == type) {
                return;
            }
            this.type = type;
            if (this.type == 1 /* FALL */) {
                this.body.sleep(false);
                this.body.state.vel.y = PingPong.Config.PLATFORM_SPEED;
            }
            else {
                throw new Error('setType static not implemented yet');
            }
        };
        Platform.prototype.getBody = function () {
            return this.body;
        };
        return Platform;
    })();
    PingPong.Platform = Platform;
})(PingPong || (PingPong = {}));
/// <reference path="./Platform.ts"/>
/// <reference path="./IPoint.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="./EPlatform.ts"/>
var PingPong;
(function (PingPong) {
    var PlatformManager = (function () {
        function PlatformManager(physic) {
            this.active = false;
            this.physic = physic;
            this.draging = false;
            this.from = null;
            this.to = null;
            this.onBuild = null;
            this.buildingPlatform = null;
            this.staticPlatforms = [];
            this.lastMove = 0;
            this.nbPlatform = 0;
            this.physic.addEvents([
                this.getPhysicsEvents()
            ]);
        }
        PlatformManager.prototype.start = function () {
            this.active = true;
        };
        PlatformManager.prototype.stop = function () {
            this.active = false;
            this.nbPlatform = 0;
        };
        PlatformManager.prototype.onPoke = function (pos) {
            this.from = pos;
        };
        PlatformManager.prototype.onMove = function (pos) {
            this.to = pos;
            if (!this.from || !this.to) {
                return;
            }
            var now = Date.now();
            if (now - this.lastMove < 15) {
                return;
            }
            this.lastMove = now;
            // Well that sucks
            this.cleanBuildingPlatform();
            this.buildingPlatform = new PingPong.Platform(this.from, this.to, 0 /* STATIC */);
            this.physic.addBody(this.buildingPlatform.getBody());
        };
        PlatformManager.prototype.onRelease = function () {
            if (!this.from || !this.to) {
                return;
            }
            this.cleanBuildingPlatform();
            this.disableStaticPlatform();
            var type = (this.nbPlatform) ? 1 /* FALL */ : 0 /* STATIC */;
            var finalPlatform = new PingPong.Platform(this.from, this.to, type);
            this.physic.addBody(finalPlatform.getBody());
            if (type == 0 /* STATIC */) {
                finalPlatform.x = 'toto';
                this.staticPlatforms.push(finalPlatform);
            }
            this.from = null;
            this.to = null;
            this.nbPlatform++;
            if (this.onBuild) {
                this.onBuild(finalPlatform);
            }
        };
        PlatformManager.prototype.disableStaticPlatform = function () {
            if (!this.staticPlatforms.length) {
                return;
            }
            this.staticPlatforms.forEach(function (platform) {
                platform.setType(1 /* FALL */);
            });
            this.staticPlatforms.length = 0;
        };
        PlatformManager.prototype.getPhysicsEvents = function () {
            return {
                'interact:poke': this.onPoke.bind(this),
                'interact:move': this.onMove.bind(this),
                'interact:release': this.onRelease.bind(this)
            };
        };
        PlatformManager.prototype.isDraging = function () {
            return this.draging;
        };
        PlatformManager.prototype.getNbPlatform = function () {
            return this.nbPlatform;
        };
        PlatformManager.prototype.cleanBuildingPlatform = function () {
            if (this.buildingPlatform) {
                this.physic.removeBody(this.buildingPlatform.getBody());
                this.buildingPlatform = null;
            }
        };
        return PlatformManager;
    })();
    PingPong.PlatformManager = PlatformManager;
})(PingPong || (PingPong = {}));
/// <reference path="./Viewport.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="./Ball.ts"/>
/// <reference path="./Lyric.ts"/>
/// <reference path="./StarterPopup.ts"/>
/// <reference path="./Constant.ts"/>
/// <reference path="./PlatformManager.ts"/>
/// <reference path="../../core/scenes/BaseScene.ts"/>
/// <reference path="../../core/resources/Style.ts"/>
/// <reference path="../../core/resources/Storage.ts"/>
var PingPong;
(function (PingPong) {
    var Storage = Resource.Storage;
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene(physic) {
            _super.call(this, 'GameScene');
            this.physic = physic;
            this.gameActive = false;
            this.nbGame = Storage.get(PingPong.Constant.NB_GAME) || 0;
            this.record = Storage.get(PingPong.Constant.RECORD) || 0;
        }
        GameScene.prototype.create = function () {
            var bg = new PIXI.Graphics();
            bg.beginFill(0xfae337);
            bg.drawRect(0, 0, this.Share.get('width'), this.Share.get('height'));
            bg.endFill();
            this.addChild(bg);
            this.viewport = new PingPong.Viewport();
            this.addChild(this.viewport);
        };
        GameScene.prototype.logic = function () {
            var _this = this;
            // The ball cannot be add on create
            // as a stage.addChild will be done on this.physic.addBody
            // Conclusion: the background will hide the background.       
            this.ball = new PingPong.Ball(this.physic);
            this.ball.onLost = this.endGame.bind(this);
            this.ball.onBump = function (pos) {
                _this.lyric.next(pos);
            };
            this.physic.addBody(this.ball.getBody());
            this.platformManager = new PingPong.PlatformManager(this.physic);
            this.platformManager.onBuild = this.startGame.bind(this);
            this.starter = new PingPong.StarterPopup();
            this.starter.open();
            this.physic.addUpdate(function () {
                _this.viewport.update();
                _this.ball.update();
            });
        };
        GameScene.prototype.startGame = function () {
            if (this.gameActive) {
                return;
            }
            this.gameActive = true;
            this.lyric = new PingPong.Lyric();
            this.platformManager.start();
            this.ball.start();
            this.viewport.start();
            this.starter.close();
        };
        GameScene.prototype.endGame = function () {
            if (!this.gameActive) {
                return;
            }
            this.gameActive = false;
            this.platformManager.stop();
            this.ball.stop();
            this.viewport.stop();
            this.nbGame++;
            Storage.set(PingPong.Constant.NB_GAME, this.nbGame);
            if (!this.record || this.record < this.viewport.getScore()) {
                console.log('set record', this.viewport.getScore());
                Storage.set(PingPong.Constant.RECORD, this.viewport.getScore());
            }
            this.starter = new PingPong.StarterPopup();
            this.starter.open();
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
/// <reference path="./GameScene.ts"/>
/// <reference path="./Physic.ts"/>
/// <reference path="../../core/scenes/SplashScene.ts"/>
/// <reference path="../../core/BaseApp.ts"/>
/// <reference path="../../core/assets/Font.ts"/>
/// <reference path="../../core/assets/Image.ts"/>
/// <reference path="../../core/assets/Sound.ts"/>
var PingPong;
(function (PingPong) {
    var App = (function (_super) {
        __extends(App, _super);
        function App() {
            _super.call(this);
            console.log('init ping pong game');
            this.physic = new PingPong.Physic();
        }
        App.prototype.start = function () {
            var _this = this;
            console.log('app start todo');
            var gameScene = new PingPong.GameScene(this.physic);
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
/// <reference path="./core/assets/Font.ts"/>
/// <reference path="./core/assets/Image.ts"/>
/// <reference path="./core/assets/Sound.ts"/>
/// <reference path="./games/pingpong/App.ts"/>
var app = new PingPong.App();
app.getLoaderEntry()
    .add(new Asset.Image('fantouch', 'public/images/fantouch.png'));
app.start();