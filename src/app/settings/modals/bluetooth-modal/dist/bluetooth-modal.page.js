"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BluetoothModalPage = void 0;
var core_1 = require("@angular/core");
var BluetoothModalPage = /** @class */ (function () {
    function BluetoothModalPage(modalController, bluetoothService) {
        this.modalController = modalController;
        this.foundDevice = true;
    }
    BluetoothModalPage.prototype.ngOnInit = function () {
    };
    BluetoothModalPage.prototype.dismiss = function () {
        this.modalController.dismiss();
    };
    BluetoothModalPage = __decorate([
        core_1.Component({
            selector: 'app-bluetooth-modal',
            templateUrl: './bluetooth-modal.page.html',
            styleUrls: ['./bluetooth-modal.page.scss']
        })
    ], BluetoothModalPage);
    return BluetoothModalPage;
}());
exports.BluetoothModalPage = BluetoothModalPage;
