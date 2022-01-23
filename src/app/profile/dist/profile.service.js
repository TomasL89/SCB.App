"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ProfileService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ProfileService = /** @class */ (function () {
    function ProfileService(storage) {
        this.storage = storage;
        this.currentProfile = new rxjs_1.Subject();
        this.init();
    }
    ProfileService.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, newProfile, currentProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.create()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.storage.get("profiles")];
                    case 2:
                        profiles = _a.sent();
                        if (!(profiles === null)) return [3 /*break*/, 4];
                        console.log("no profiles saved");
                        newProfile = Array();
                        return [4 /*yield*/, this.storage.set("profiles", newProfile)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        currentProfile = profiles.find(function (s) { return s.selected === true; });
                        this.currentProfile.next(currentProfile);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProfileService.prototype.createNewProfile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, newProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!profile) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.storage.get("profiles")];
                    case 1:
                        profiles = _a.sent();
                        if (!(profiles === null)) return [3 /*break*/, 3];
                        newProfile = Array();
                        this.currentProfile.next(profile);
                        newProfile.push(profile);
                        return [4 /*yield*/, this.storage.set("profiles", newProfile)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        if (profiles.length === 0) {
                            profile.selected = true;
                        }
                        _a.label = 4;
                    case 4:
                        profiles.push(profile);
                        this.currentProfile.next(profile);
                        return [4 /*yield*/, this.storage.set("profiles", profiles)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfileService.prototype.getProfiles = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get("profiles")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProfileService.prototype.deleteProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get("profiles")];
                    case 1:
                        profiles = _a.sent();
                        index = profiles.findIndex(function (p) { return p.id === id; });
                        profiles.splice(index, 1);
                        this.currentProfile.next(undefined);
                        return [4 /*yield*/, this.storage.set("profiles", profiles)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, profiles];
                }
            });
        });
    };
    ProfileService.prototype.selectProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, index, profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get("profiles")];
                    case 1:
                        profiles = _a.sent();
                        index = profiles.findIndex(function (p) { return p.id === id; });
                        profiles.forEach(function (profile) {
                            profile.selected = false;
                        });
                        profile = profiles[index];
                        profile.selected = true;
                        this.currentProfile.next(profile);
                        return [4 /*yield*/, this.storage.set("profiles", profiles)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProfileService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
