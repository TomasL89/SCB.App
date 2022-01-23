"use strict";
exports.__esModule = true;
exports.Profile = void 0;
var Profile = /** @class */ (function () {
    function Profile(id, name, boilerTemperature, pumpPressure, preInfusionTime, shotTime, selected) {
        this.id = id;
        this.name = name;
        this.boilerTemperature = boilerTemperature;
        this.pumpPressure = pumpPressure;
        this.preInfusionTime = preInfusionTime;
        this.shotTime = shotTime;
        this.selected = selected;
    }
    return Profile;
}());
exports.Profile = Profile;
