/// <reference path="../../../typings/pixi.js/pixi.js.d.ts"/>

module Popup {
  export interface IPopup extends PIXI.DisplayObject {
    close();
  }
}