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
const nestjs_rmq_1 = __webpack_require__(6);
const common_1 = __webpack_require__(2);
const users_module_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(36);
// import { ConfigModule } from '@nestjs/config';
const rmq_config_1 = __webpack_require__(41);
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            // ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
            nestjs_rmq_1.RMQModule.forRootAsync((0, rmq_config_1.getRMQConfig)()),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("nestjs-rmq");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const users_repository_1 = __webpack_require__(8);
const users_commands_1 = __webpack_require__(13);
const users_event_emitter_1 = __webpack_require__(15);
const users_queries_1 = __webpack_require__(34);
const users_service_1 = __webpack_require__(14);
const prisma_module_1 = __webpack_require__(35);
let UsersModule = exports.UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [users_repository_1.UsersRepository, users_event_emitter_1.UserEventEmitter, users_service_1.UserService],
        exports: [users_repository_1.UsersRepository, users_event_emitter_1.UserEventEmitter],
        controllers: [users_commands_1.UserCommands, users_queries_1.UserQueries],
    })
], UsersModule);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersRepository = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const user_entity_1 = __webpack_require__(9);
const prisma_service_1 = __webpack_require__(11);
let UsersRepository = exports.UsersRepository = class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        const userCreateInput = {
            id: data.id,
            email: data.email,
            passwordHash: data.passwordHash,
        };
        const newUser = await this.prisma.user.create({
            data: userCreateInput,
        });
        return new user_entity_1.UserEntity(newUser);
    }
    async updateUser({ id: _id, ...rest }) {
        return this.prisma.user.update({
            where: { id: _id },
            data: { ...rest },
        });
    }
    async findUser(email) {
        return this.prisma.user.findFirst({
            where: { email: email },
        });
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id: id },
        });
    }
    async deleteUser(email) {
        return this.prisma.user.delete({
            where: { email: email },
        });
    }
};
exports.UsersRepository = UsersRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersRepository);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const bcryptjs_1 = __webpack_require__(10);
class UserEntity {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.isVerified = user.isVerified;
        this.passwordHash = user.passwordHash;
    }
    getPublicProfile() {
        return {
            id: this.id,
            email: this.email,
            isVerified: this.isVerified,
        };
    }
    async setPassword(password) {
        const salt = await (0, bcryptjs_1.genSalt)(10);
        this.passwordHash = await (0, bcryptjs_1.hash)(password, salt);
        return this;
    }
    validatePassword(password) {
        return (0, bcryptjs_1.compare)(password, this.passwordHash);
    }
}
exports.UserEntity = UserEntity;


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var PrismaService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const accounts_1 = __webpack_require__(12);
let PrismaService = exports.PrismaService = PrismaService_1 = class PrismaService extends accounts_1.PrismaClient {
    constructor() {
        super({
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
                {
                    emit: 'event',
                    level: 'error',
                },
                {
                    emit: 'event',
                    level: 'info',
                },
                {
                    emit: 'event',
                    level: 'warn',
                },
            ],
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        await this.$connect();
        this.$on('error', ({ message }) => {
            this.logger.error(message);
        });
        this.$on('warn', ({ message }) => {
            this.logger.warn(message);
        });
        this.$on('info', ({ message }) => {
            this.logger.debug(message);
        });
        this.$on('query', ({ query, params }) => {
            this.logger.log(`${query}; ${params}`);
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService = PrismaService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("@prisma/client/accounts");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCommands = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const users_service_1 = __webpack_require__(14);
let UserCommands = exports.UserCommands = class UserCommands {
    constructor(userService) {
        this.userService = userService;
    }
};
exports.UserCommands = UserCommands = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UserService !== "undefined" && users_service_1.UserService) === "function" ? _a : Object])
], UserCommands);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_rmq_1 = __webpack_require__(6);
const users_repository_1 = __webpack_require__(8);
const users_event_emitter_1 = __webpack_require__(15);
let UserService = exports.UserService = class UserService {
    constructor(usersRepository, rmqService, usersEventEmmiter) {
        this.usersRepository = usersRepository;
        this.rmqService = rmqService;
        this.usersEventEmmiter = usersEventEmmiter;
    }
    updateUser(user) {
        return Promise.all([
            this.usersRepository.updateUser(user)
        ]);
    }
};
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_repository_1.UsersRepository !== "undefined" && users_repository_1.UsersRepository) === "function" ? _a : Object, typeof (_b = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _b : Object, typeof (_c = typeof users_event_emitter_1.UserEventEmitter !== "undefined" && users_event_emitter_1.UserEventEmitter) === "function" ? _c : Object])
], UserService);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEventEmitter = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_rmq_1 = __webpack_require__(6);
const contracts_1 = __webpack_require__(16);
let UserEventEmitter = exports.UserEventEmitter = class UserEventEmitter {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    async emitEvent(event) {
        try {
            await this.rmqService.notify(event.topic, event.data);
        }
        catch (e) {
            if (e instanceof Error) {
                common_1.Logger.error(e.message);
            }
        }
    }
    async emitUserCreated(user) {
        const event = {
            topic: contracts_1.AccountUserCreatedEvent.topic,
            data: { userId: user.id },
        };
        return this.emitEvent(event);
    }
};
exports.UserEventEmitter = UserEventEmitter = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], UserEventEmitter);


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


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserQueries = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const contracts_1 = __webpack_require__(16);
const nestjs_rmq_1 = __webpack_require__(6);
const user_entity_1 = __webpack_require__(9);
const users_repository_1 = __webpack_require__(8);
let UserQueries = exports.UserQueries = class UserQueries {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async userInfo({ userId }) {
        const user = await this.usersRepository.findUserById(userId);
        const userPublic = new user_entity_1.UserEntity(user).getPublicProfile();
        return {
            user: userPublic,
        };
    }
};
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountQueryUserInfo.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.AccountQueryUserInfo !== "undefined" && contracts_1.AccountQueryUserInfo.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserQueries.prototype, "userInfo", null);
exports.UserQueries = UserQueries = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_repository_1.UsersRepository !== "undefined" && users_repository_1.UsersRepository) === "function" ? _a : Object])
], UserQueries);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(11);
let PrismaModule = exports.PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(37);
const jwt_config_1 = __webpack_require__(38);
const users_module_1 = __webpack_require__(7);
const auth_controller_1 = __webpack_require__(39);
const auth_service_1 = __webpack_require__(40);
let AuthModule = exports.AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, jwt_1.JwtModule.registerAsync((0, jwt_config_1.getJWTConfig)())],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJWTConfig = void 0;
const getJWTConfig = () => ({
    // imports: [ConfigModule],
    // inject: [ConfigService],
    // useFactory: (configService: ConfigService) => ({
    useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: process.env.JWT_EXP_H,
        },
    }),
});
exports.getJWTConfig = getJWTConfig;


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const contracts_1 = __webpack_require__(16);
const nestjs_rmq_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(40);
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        const payload = this.authService.register(dto);
        return payload;
    }
    async login({ email, password }) {
        const { id } = await this.authService.validateUser(email, password);
        return this.authService.login(id);
    }
};
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountRegister.topic),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.AccountRegister !== "undefined" && contracts_1.AccountRegister.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountLogin.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof contracts_1.AccountLogin !== "undefined" && contracts_1.AccountLogin.Request) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(37);
const user_entity_1 = __webpack_require__(9);
const users_repository_1 = __webpack_require__(8);
const users_event_emitter_1 = __webpack_require__(15);
let AuthService = exports.AuthService = class AuthService {
    constructor(usersRepository, usersEventEmitter, jwtService) {
        this.usersRepository = usersRepository;
        this.usersEventEmitter = usersEventEmitter;
        this.jwtService = jwtService;
    }
    async register({ email, password }) {
        const oldUser = await this.usersRepository.findUser(email);
        if (oldUser) {
            throw new Error('Такой пользователь уже зарегистрирован');
        }
        const newUserEntity = await new user_entity_1.UserEntity({
            email: email,
            isVerified: false,
            passwordHash: '',
        }).setPassword(password);
        const newUser = await this.usersRepository.createUser(newUserEntity);
        this.usersEventEmitter.emitUserCreated(newUser);
        return { email: newUser.email };
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findUser(email);
        if (!user) {
            throw new Error('Неверный логин или пароль');
        }
        const userEntity = new user_entity_1.UserEntity(user);
        const isCorrectPassword = await userEntity.validatePassword(password);
        if (!isCorrectPassword) {
            throw new Error('Неверный логин или пароль');
        }
        return { id: user.id };
    }
    async login(id) {
        const token = await this.jwtService.signAsync({ id });
        return {
            access_token: token,
        };
    }
};
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_repository_1.UsersRepository !== "undefined" && users_repository_1.UsersRepository) === "function" ? _a : Object, typeof (_b = typeof users_event_emitter_1.UserEventEmitter !== "undefined" && users_event_emitter_1.UserEventEmitter) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const getRMQConfig = () => ({
    // inject: [ConfigService],
    // imports: [ConfigModule],
    // useFactory: (configService: ConfigService) => ({
    useFactory: () => ({
        exchangeName: process.env.AMQP_EXCHANGE ?? '',
        connections: [
            {
                login: process.env.AMQP_USER ?? '',
                password: process.env.AMQP_PASSWORD ?? '',
                host: process.env.AMQP_HOSTNAME ?? ''
            }
        ],
        queueName: process.env.AMQP_QUEUE,
        prefetchCount: 32,
        serviceName: 'rmq-account'
        // exchangeName: configService.get('AMQP_EXCHANGE') ?? '',
        // connections: [
        // 	{
        // 		login: configService.get('AMQP_USER') ?? '',
        // 		password: configService.get('AMQP_PASSWORD') ?? '',
        // 		host: configService.get('AMQP_HOSTNAME') ?? ''
        // 	}
        // ],
        // queueName: configService.get('AMQP_QUEUE'),
        // prefetchCount: 32,
        // serviceName: 'rmq-account'
    })
});
exports.getRMQConfig = getRMQConfig;


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
// import dotenv from 'dotenv'
// dotenv.config()
__webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
async function bootstrap() {
    console.log(process.env.AMQP_HOSTNAME);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    common_1.Logger.log(`🚀 Accounts microservice is running`);
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map