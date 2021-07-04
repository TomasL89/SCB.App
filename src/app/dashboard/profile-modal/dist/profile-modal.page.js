"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfileModalPage = void 0;
var core_1 = require("@angular/core");
var profile_model_1 = require("src/app/profile/profile.model");
var forms_1 = require("@angular/forms");
var uuid_1 = require("uuid");
var ProfileModalPage = /** @class */ (function () {
    function ProfileModalPage(modalController, profileService) {
        this.modalController = modalController;
        this.profileService = profileService;
        this.profileForm = new forms_1.FormGroup({
            name: new forms_1.FormControl(''),
            boilerTemperature: new forms_1.FormControl(''),
            pumpPressure: new forms_1.FormControl(''),
            preInfusionTime: new forms_1.FormControl(''),
            shotTime: new forms_1.FormControl('')
        });
    }
    ProfileModalPage.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.profileSubscription = this.profileService.currentProfile.subscribe(function (profile) {
            _this.currentProfile = profile;
            console.log(profile);
        }, (function (error) {
            console.error(error);
        }));
        this.profileService.getProfiles().then(function (profiles) {
            _this.profiles = profiles;
            console.log(profiles);
        });
    };
    ProfileModalPage.prototype.dismiss = function () {
        this.modalController.dismiss({
            'dismissed': true
        });
    };
    ProfileModalPage.prototype.enableEditMode = function () {
        this.isEditMode = !this.isEditMode;
    };
    ProfileModalPage.prototype.enableLibraryMode = function () {
        this.isLibraryMode = !this.isLibraryMode;
    };
    ProfileModalPage.prototype.saveProfile = function () {
        if (this.profileForm.invalid)
            return;
        // todo fix the input later
        var name = this.profileForm.get('name').value;
        var boilerTemp = this.profileForm.get('boilerTemperature').value.replace(/\D/g, '');
        var pumpPressure = this.profileForm.get('pumpPressure').value.replace(/\D/g, '');
        var preInfusionTime = this.profileForm.get('preInfusionTime').value.replace(/\D/g, '');
        var shotTime = this.profileForm.get('shotTime').value.replace(/\D/g, '');
        var id = uuid_1.v4();
        var newProfile = new profile_model_1.Profile(String(id), name, boilerTemp, pumpPressure, preInfusionTime, shotTime, false);
        this.profileService.createNewProfile(newProfile);
        this.currentProfile = newProfile;
        this.dismiss();
    };
    ProfileModalPage.prototype.selectProfile = function (id) {
        this.profileService.selectProfile(id);
        this.dismiss();
    };
    ProfileModalPage.prototype.deleteProfile = function (id) {
        var _this = this;
        this.profileService.deleteProfile(id).then(function (profiles) {
            console.log(profiles);
            _this.profiles = profiles;
        });
    };
    ProfileModalPage.prototype.editProfile = function (id) {
    };
    ProfileModalPage = __decorate([
        core_1.Component({
            selector: 'app-profile-modal',
            templateUrl: './profile-modal.page.html',
            styleUrls: ['./profile-modal.page.scss']
        })
    ], ProfileModalPage);
    return ProfileModalPage;
}());
exports.ProfileModalPage = ProfileModalPage;
