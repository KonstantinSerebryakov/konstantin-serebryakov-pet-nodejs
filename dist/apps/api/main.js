/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(7);
const passport_1 = __webpack_require__(8);
const schedule_1 = __webpack_require__(9);
const nestjs_rmq_1 = __webpack_require__(10);
const jwt_config_1 = __webpack_require__(11);
const rmq_config_1 = __webpack_require__(12);
const serve_static_1 = __webpack_require__(13);
const path_1 = __webpack_require__(14);
const auth_controller_1 = __webpack_require__(15);
const users_controller_1 = __webpack_require__(38);
const jwt_strategy_1 = __webpack_require__(41);
const api_service_1 = __webpack_require__(36);
const profiles_controller_1 = __webpack_require__(43);
const profiles_nested_controller_1 = __webpack_require__(49);
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'client'),
                renderPath: '/',
            }),
            config_1.ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
            nestjs_rmq_1.RMQModule.forRootAsync((0, rmq_config_1.getRMQConfig)()),
            jwt_1.JwtModule.registerAsync((0, jwt_config_1.getJWTConfig)()),
            passport_1.PassportModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [
            auth_controller_1.AuthController,
            users_controller_1.UsersController,
            profiles_controller_1.ProfilesController,
            profiles_nested_controller_1.ProfilesNestedController,
        ],
        providers: [jwt_strategy_1.JwtStrategy, api_service_1.ApiService],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("nestjs-rmq");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJWTConfig = void 0;
const config_1 = __webpack_require__(6);
const getJWTConfig = () => ({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get('JWT_EXP_H'),
        },
    }),
});
exports.getJWTConfig = getJWTConfig;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const config_1 = __webpack_require__(6);
const getRMQConfig = () => ({
    inject: [config_1.ConfigService],
    imports: [config_1.ConfigModule],
    useFactory: (configService) => ({
        exchangeName: configService.get('AMQP_EXCHANGE') ?? '',
        connections: [
            {
                login: configService.get('AMQP_USER') ?? '',
                password: configService.get('AMQP_PASSWORD') ?? '',
                host: configService.get('AMQP_HOSTNAME') ?? ''
            }
        ],
        prefetchCount: 32,
        serviceName: 'rmq-api'
    })
});
exports.getRMQConfig = getRMQConfig;


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const contracts_1 = __webpack_require__(16);
const nestjs_rmq_1 = __webpack_require__(10);
const login_dto_1 = __webpack_require__(34);
const register_dto_1 = __webpack_require__(35);
const api_service_1 = __webpack_require__(36);
const CONTROLLER_PREFIX = 'auth';
let AuthController = exports.AuthController = class AuthController {
    constructor(rmqService, apiService) {
        this.rmqService = rmqService;
        this.apiService = apiService;
    }
    async register(dto) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.AccountRegister.topic, dto, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.UnauthorizedException(e.message);
            }
        }
    }
    async login(dto) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.AccountLogin.topic, dto, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                throw new common_1.UnauthorizedException(e.message);
            }
        }
    }
};
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object, typeof (_b = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _b : Object])
], AuthController);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(5);
//
// accounts
//
tslib_1.__exportStar(__webpack_require__(17), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);
//
// profiles
//
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(26), exports);
tslib_1.__exportStar(__webpack_require__(27), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountLogin = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var AccountLogin;
(function (AccountLogin) {
    AccountLogin.topic = 'account.login.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsEmail)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "email", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "password", void 0);
    AccountLogin.Request = Request;
    class Response {
    }
    AccountLogin.Response = Response;
})(AccountLogin || (exports.AccountLogin = AccountLogin = {}));


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountRegister = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var AccountRegister;
(function (AccountRegister) {
    AccountRegister.topic = 'account.register.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsEmail)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "email", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "password", void 0);
    AccountRegister.Request = Request;
    class Response {
    }
    AccountRegister.Response = Response;
})(AccountRegister || (exports.AccountRegister = AccountRegister = {}));


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountChangeUserInfo = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var AccountChangeUserInfo;
(function (AccountChangeUserInfo) {
    AccountChangeUserInfo.topic = 'account.change_user_info.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    AccountChangeUserInfo.Request = Request;
    class Response {
    }
    AccountChangeUserInfo.Response = Response;
})(AccountChangeUserInfo || (exports.AccountChangeUserInfo = AccountChangeUserInfo = {}));


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountQueryUserInfo = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var AccountQueryUserInfo;
(function (AccountQueryUserInfo) {
    AccountQueryUserInfo.topic = 'account.user_info.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    AccountQueryUserInfo.Request = Request;
    class Response {
    }
    AccountQueryUserInfo.Response = Response;
})(AccountQueryUserInfo || (exports.AccountQueryUserInfo = AccountQueryUserInfo = {}));


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUserCreatedEvent = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var AccountUserCreatedEvent;
(function (AccountUserCreatedEvent) {
    AccountUserCreatedEvent.topic = 'account.user_created.event';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    AccountUserCreatedEvent.Request = Request;
})(AccountUserCreatedEvent || (exports.AccountUserCreatedEvent = AccountUserCreatedEvent = {}));


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileCreateOne = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileCreateOne;
(function (ProfileCreateOne) {
    ProfileCreateOne.topic = 'profile.create_user_profile.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileCreateOne.Request = Request;
    class Response {
    }
    ProfileCreateOne.Response = Response;
})(ProfileCreateOne || (exports.ProfileCreateOne = ProfileCreateOne = {}));


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileDeleteOne = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileDeleteOne;
(function (ProfileDeleteOne) {
    ProfileDeleteOne.topic = 'profile.delete_user_profile.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "profileId", void 0);
    ProfileDeleteOne.Request = Request;
    class Response {
    }
    ProfileDeleteOne.Response = Response;
})(ProfileDeleteOne || (exports.ProfileDeleteOne = ProfileDeleteOne = {}));


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChange = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileChange;
(function (ProfileChange) {
    ProfileChange.topic = 'profile.change_user_profile.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "profileId", void 0);
    ProfileChange.Request = Request;
    class Response {
    }
    ProfileChange.Response = Response;
})(ProfileChange || (exports.ProfileChange = ProfileChange = {}));


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileQuery = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileQuery;
(function (ProfileQuery) {
    ProfileQuery.topic = 'profile.user_profile.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "profileId", void 0);
    ProfileQuery.Request = Request;
    class Response {
    }
    ProfileQuery.Response = Response;
})(ProfileQuery || (exports.ProfileQuery = ProfileQuery = {}));


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileChangeDefault;
(function (ProfileChangeDefault) {
    ProfileChangeDefault.topic = 'profile.change_user_profile_default.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileChangeDefault.Request = Request;
    class Response {
    }
    ProfileChangeDefault.Response = Response;
})(ProfileChangeDefault || (exports.ProfileChangeDefault = ProfileChangeDefault = {}));


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileQueryDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileQueryDefault;
(function (ProfileQueryDefault) {
    ProfileQueryDefault.topic = 'profile.user_profile_default.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileQueryDefault.Request = Request;
    class Response {
    }
    ProfileQueryDefault.Response = Response;
})(ProfileQueryDefault || (exports.ProfileQueryDefault = ProfileQueryDefault = {}));


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileQueryUserProfilesIds = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileQueryUserProfilesIds;
(function (ProfileQueryUserProfilesIds) {
    ProfileQueryUserProfilesIds.topic = 'profile.user_profiles_ids.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileQueryUserProfilesIds.Request = Request;
    class Response {
    }
    ProfileQueryUserProfilesIds.Response = Response;
})(ProfileQueryUserProfilesIds || (exports.ProfileQueryUserProfilesIds = ProfileQueryUserProfilesIds = {}));


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeCredential = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileChangeCredential;
(function (ProfileChangeCredential) {
    ProfileChangeCredential.topic = 'profile.change_profile_credential.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "profileId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileChangeCredential.Request = Request;
    class Response {
    }
    ProfileChangeCredential.Response = Response;
})(ProfileChangeCredential || (exports.ProfileChangeCredential = ProfileChangeCredential = {}));


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeCredentialDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileChangeCredentialDefault;
(function (ProfileChangeCredentialDefault) {
    ProfileChangeCredentialDefault.topic = 'profile.change_profile_credential_default.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileChangeCredentialDefault.Request = Request;
    class Response {
    }
    ProfileChangeCredentialDefault.Response = Response;
})(ProfileChangeCredentialDefault || (exports.ProfileChangeCredentialDefault = ProfileChangeCredentialDefault = {}));


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeSocialMediaNodes = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileChangeSocialMediaNodes;
(function (ProfileChangeSocialMediaNodes) {
    ProfileChangeSocialMediaNodes.topic = 'profile.change_social_media_nodes.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "profileId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileChangeSocialMediaNodes.Request = Request;
    class Response {
    }
    ProfileChangeSocialMediaNodes.Response = Response;
})(ProfileChangeSocialMediaNodes || (exports.ProfileChangeSocialMediaNodes = ProfileChangeSocialMediaNodes = {}));


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeSocialMediaNodesDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
var ProfileChangeSocialMediaNodesDefault;
(function (ProfileChangeSocialMediaNodesDefault) {
    ProfileChangeSocialMediaNodesDefault.topic = 'profile.change_social_media_nodes_default.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    ProfileChangeSocialMediaNodesDefault.Request = Request;
    class Response {
    }
    ProfileChangeSocialMediaNodesDefault.Response = Response;
})(ProfileChangeSocialMediaNodesDefault || (exports.ProfileChangeSocialMediaNodesDefault = ProfileChangeSocialMediaNodesDefault = {}));


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
class LoginDto {
}
exports.LoginDto = LoginDto;
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const uuid_1 = __webpack_require__(37);
let ApiService = exports.ApiService = class ApiService {
    async generateRequestId(prefix) {
        const uuid = (0, uuid_1.v4)();
        return prefix + '-' + uuid;
    }
};
exports.ApiService = ApiService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ApiService);


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const jwt_guard_1 = __webpack_require__(39);
const user_decorator_1 = __webpack_require__(40);
const nestjs_rmq_1 = __webpack_require__(10);
const api_service_1 = __webpack_require__(36);
const contracts_1 = __webpack_require__(16);
const CONTROLLER_PREFIX = 'users';
let UsersController = exports.UsersController = class UsersController {
    constructor(rmqService, apiService) {
        this.rmqService = rmqService;
        this.apiService = apiService;
    }
    async getUserInfo(userId) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.AccountQueryUserInfo.topic, { userId: userId }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
};
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)('info'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getUserInfo", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object, typeof (_b = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _b : Object])
], UsersController);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWTAuthGuard = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(8);
let JWTAuthGuard = exports.JWTAuthGuard = class JWTAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JWTAuthGuard = JWTAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], JWTAuthGuard);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserId = void 0;
const common_1 = __webpack_require__(2);
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    return ctx.switchToHttp().getRequest()?.user;
});


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(8);
const passport_jwt_1 = __webpack_require__(42);
const date = new Date();
let JwtStrategy = exports.JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }
    async validate({ id, exp }) {
        const currentTimestamp = date.getTime() / 1000;
        if (exp < currentTimestamp) {
            throw new common_1.UnauthorizedException('Token has expired');
        }
        return id;
    }
};
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 42 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const jwt_guard_1 = __webpack_require__(39);
const user_decorator_1 = __webpack_require__(40);
const nestjs_rmq_1 = __webpack_require__(10);
const api_service_1 = __webpack_require__(36);
const profile_dto_1 = __webpack_require__(44);
const contracts_1 = __webpack_require__(16);
const CONTROLLER_PREFIX = 'profiles';
let ProfilesController = exports.ProfilesController = class ProfilesController {
    constructor(rmqService, apiService) {
        this.rmqService = rmqService;
        this.apiService = apiService;
    }
    async getProfileDefault(userId) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileQueryDefault.topic, { userId: userId }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async changeProfileDefault(userId, profile) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileChangeDefault.topic, { userId: userId, profile: profile }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async getProfilesList(userId) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileQueryUserProfilesIds.topic, { userId: userId }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async createProfile(userId, profileId) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileCreateOne.topic, { userId: userId }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
};
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)('default'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesController.prototype, "getProfileDefault", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Put)('default'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof profile_dto_1.ProfileDto !== "undefined" && profile_dto_1.ProfileDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesController.prototype, "changeProfileDefault", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)('list'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesController.prototype, "getProfilesList", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Post)('new'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)('profileId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesController.prototype, "createProfile", null);
exports.ProfilesController = ProfilesController = tslib_1.__decorate([
    (0, common_1.Controller)('profiles'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object, typeof (_b = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _b : Object])
], ProfilesController);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileDto = void 0;
const tslib_1 = __webpack_require__(5);
const class_transformer_1 = __webpack_require__(45);
const class_validator_1 = __webpack_require__(18);
const social_media_node_dto_1 = __webpack_require__(46);
class ProfileDto {
    constructor() {
        this.userId = "";
    }
}
exports.ProfileDto = ProfileDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], ProfileDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", Object)
], ProfileDto.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ProfileDto.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => social_media_node_dto_1.SocialMediaNodeDto),
    tslib_1.__metadata("design:type", Array)
], ProfileDto.prototype, "socialMediaNodes", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", Object)
], ProfileDto.prototype, "credential", void 0);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialMediaNodeDto = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
const social_media_variant_dto_1 = __webpack_require__(47);
class SocialMediaNodeDto {
}
exports.SocialMediaNodeDto = SocialMediaNodeDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], SocialMediaNodeDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], SocialMediaNodeDto.prototype, "profileId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof social_media_variant_dto_1.SocialMediaVariantDto !== "undefined" && social_media_variant_dto_1.SocialMediaVariantDto) === "function" ? _a : Object)
], SocialMediaNodeDto.prototype, "socialMediaVariant", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], SocialMediaNodeDto.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], SocialMediaNodeDto.prototype, "link", void 0);


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialMediaVariantDto = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
const class_validator_extended_1 = __webpack_require__(48);
class SocialMediaVariantDto {
}
exports.SocialMediaVariantDto = SocialMediaVariantDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], SocialMediaVariantDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_extended_1.Nullable)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    (0, class_validator_1.IsUrl)(),
    tslib_1.__metadata("design:type", Object)
], SocialMediaVariantDto.prototype, "iconUrl", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.MinLength)(2),
    tslib_1.__metadata("design:type", String)
], SocialMediaVariantDto.prototype, "name", void 0);


/***/ }),
/* 48 */
/***/ ((module) => {

module.exports = require("class-validator-extended");

/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesNestedController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const jwt_guard_1 = __webpack_require__(39);
const user_decorator_1 = __webpack_require__(40);
const nestjs_rmq_1 = __webpack_require__(10);
const api_service_1 = __webpack_require__(36);
const profile_dto_1 = __webpack_require__(44);
const contracts_1 = __webpack_require__(16);
const credential_dto_1 = __webpack_require__(50);
const CONTROLLER_PREFIX = 'profiles-nested';
const PARAM_PROFILE_ID = 'profileId';
let ProfilesNestedController = exports.ProfilesNestedController = class ProfilesNestedController {
    constructor(rmqService, apiService) {
        this.rmqService = rmqService;
        this.apiService = apiService;
    }
    async getProfileById(userId, profileId) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            console.log(id);
            console.log(id);
            console.log(id);
            console.log(id);
            console.log(id);
            return await this.rmqService.send(contracts_1.ProfileQuery.topic, { userId: userId, profileId: profileId }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async changeProfile(userId, profileId, profile) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileChange.topic, { userId: userId, profileId: profileId, profile: profile }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async deleteProfile(userId, profileId) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileDeleteOne.topic, { userId: userId, profileId: profileId }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async updateProfileCredential(userId, profileId, credential) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            // await new Promise((resolve, reject)=>{
            // setTimeout(resolve, 10000);
            // });
            return await this.rmqService.send(contracts_1.ProfileChangeCredential.topic, { userId: userId, profileId: profileId, credential: credential }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
    async updateProfileSocialMediaNodes(userId, profileId, socialMediaNodes) {
        try {
            const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
            return await this.rmqService.send(contracts_1.ProfileChangeSocialMediaNodes.topic, { userId: userId, profileId: profileId, socialMediaNodes: socialMediaNodes }, { headers: { requestId: id } });
        }
        catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
                throw new common_1.InternalServerErrorException(e.message);
            }
        }
    }
};
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(''),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)(PARAM_PROFILE_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesNestedController.prototype, "getProfileById", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Put)(''),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)(PARAM_PROFILE_ID)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, typeof (_c = typeof profile_dto_1.ProfileDto !== "undefined" && profile_dto_1.ProfileDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesNestedController.prototype, "changeProfile", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Delete)(''),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)(PARAM_PROFILE_ID)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesNestedController.prototype, "deleteProfile", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Put)('credential'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)(PARAM_PROFILE_ID)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, typeof (_d = typeof credential_dto_1.CredentialDto !== "undefined" && credential_dto_1.CredentialDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesNestedController.prototype, "updateProfileCredential", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Post)('social-media-nodes'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)(PARAM_PROFILE_ID)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesNestedController.prototype, "updateProfileSocialMediaNodes", null);
exports.ProfilesNestedController = ProfilesNestedController = tslib_1.__decorate([
    (0, common_1.Controller)(`profiles/profile/:${PARAM_PROFILE_ID}/`),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object, typeof (_b = typeof api_service_1.ApiService !== "undefined" && api_service_1.ApiService) === "function" ? _b : Object])
], ProfilesNestedController);


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CredentialDto = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(18);
const class_validator_extended_1 = __webpack_require__(48);
class CredentialDto {
}
exports.CredentialDto = CredentialDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], CredentialDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], CredentialDto.prototype, "profileId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    tslib_1.__metadata("design:type", String)
], CredentialDto.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    tslib_1.__metadata("design:type", String)
], CredentialDto.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, class_validator_extended_1.Nullable)()
    // @IsDate()
    // @IsValidBirthday()
    ,
    tslib_1.__metadata("design:type", Object)
], CredentialDto.prototype, "birthday", void 0);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(); //TODO: delete this on deploy!
    app.useGlobalPipes(new common_1.ValidationPipe({
        enableDebugMessages: true,
        skipMissingProperties: false,
        whitelist: true,
        transform: true,
    }));
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3333;
    await app.listen(port);
    common_1.Logger.log(`🚀 API gateway microservice is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map