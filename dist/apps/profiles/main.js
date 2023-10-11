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
const config_1 = __webpack_require__(7);
const rmq_config_1 = __webpack_require__(8);
const profiles_repository_1 = __webpack_require__(9);
const porfiles_service_1 = __webpack_require__(16);
const profiles_commands_1 = __webpack_require__(18);
const profiles_queries_1 = __webpack_require__(37);
const prisma_module_1 = __webpack_require__(38);
const profiles_events_1 = __webpack_require__(39);
const axios_1 = __webpack_require__(40);
const icons8_service_1 = __webpack_require__(41);
const profiles_nested_commands_1 = __webpack_require__(42);
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.profile.env' }),
            nestjs_rmq_1.RMQModule.forRootAsync((0, rmq_config_1.getRMQConfig)()),
            prisma_module_1.PrismaModule
        ],
        controllers: [profiles_commands_1.ProfilesCommands, profiles_nested_commands_1.ProfilesNestedCommands, profiles_queries_1.ProfilesQueries, profiles_events_1.ProfilesEvents],
        providers: [profiles_repository_1.ProfilesRepository, porfiles_service_1.ProfileService, icons8_service_1.IconsService],
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
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const config_1 = __webpack_require__(7);
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
        queueName: configService.get('AMQP_QUEUE'),
        prefetchCount: 32,
        serviceName: 'rmq-profile'
    })
});
exports.getRMQConfig = getRMQConfig;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesRepository = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
const profile_entity_1 = __webpack_require__(12);
const profiles_1 = __webpack_require__(11);
const socialMediaNode_entity_1 = __webpack_require__(14);
const socialMediaVariant_entity_1 = __webpack_require__(15);
let ProfilesRepository = exports.ProfilesRepository = class ProfilesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        this.defaultSocialMediaVariantIds =
            await this.generateDefaultSocialMediaVariants();
    }
    async generateDefaultSocialMediaVariants() {
        const socialMediaVariants = [
            { iconUrl: '111', name: '11111111111111111111111' },
            { iconUrl: '222', name: '22222222222222222222222' },
        ];
        return Promise.all(socialMediaVariants.map(async (variant) => {
            return this.prisma.socialMediaVariant
                .upsert({
                where: { name: variant.name },
                create: variant,
                update: {},
            })
                .then((variant) => variant.id);
        }));
    }
    async generateProfileDefault(userId) {
        const defaults = {
            userId: userId,
            isDefault: true,
            credential: {
                create: {
                    firstName: '',
                    lastName: '',
                    birthday: null,
                },
            },
            socialMediaNodes: {
                createMany: {
                    data: this.defaultSocialMediaVariantIds.map((id) => {
                        return {
                            variantId: id,
                            isActive: false,
                            link: '',
                        };
                    }),
                    skipDuplicates: true,
                },
            },
        };
        return this.prisma.profile.create({
            data: defaults,
            select: {
                id: true,
                userId: true,
            },
        });
    }
    //
    // PROFILE
    //
    async generateProfileCreateInputWithDefault(userId) {
        const defaultProfile = await this.findProfileDefaultNested(userId);
        const profileCreateInput = {
            userId: userId,
            isDefault: false,
        };
        const credential = defaultProfile.credential?.getPublic();
        if (credential) {
            profileCreateInput.credential = {
                create: credential,
            };
        }
        const socialMedias = defaultProfile.socialMediaNodes?.map((socialMedia) => {
            return {
                ...socialMedia.getPublicSelf(),
                socialMediaVariant: {
                    connect: socialMedia.socialMediaVariant.getPublic(),
                },
            };
        });
        if (socialMedias) {
            profileCreateInput.socialMediaNodes = {
                create: socialMedias,
            };
        }
        return profileCreateInput;
    }
    async queryFindProfileSelf(filter, select = {}) {
        const queriedObject = await this.prisma.profile.findFirst({
            where: filter,
            select: select,
        });
        if (!queriedObject)
            throw new common_1.NotFoundException('Profile not found in database!');
        return queriedObject;
    }
    async queryFindProfileNested(filter) {
        const queriedObject = await this.prisma.profile.findFirst({
            where: filter,
            include: {
                credential: true,
                socialMediaNodes: {
                    include: {
                        socialMediaVariant: true,
                    },
                },
            },
        });
        if (!queriedObject)
            throw new common_1.NotFoundException('Profile not found in database!');
        return new profile_entity_1.ProfileEntity(queriedObject);
    }
    async findProfileDefaultNested(userId) {
        const filter = { isDefault: true, userId: userId };
        return this.queryFindProfileNested(filter);
    }
    async findProfileDefaultId(userId) {
        const filter = { isDefault: true, userId: userId };
        const select = { id: true };
        const queried = await this.queryFindProfileSelf(filter, select);
        return queried.id;
    }
    async findProfileNestedById(profileId) {
        const filter = { id: profileId };
        return this.queryFindProfileNested(filter);
    }
    async findManyProfileIdsByUserId(userId) {
        const queried = await this.prisma.profile.findMany({
            select: { id: true },
            where: { userId: userId },
        });
        return queried.map((item) => item.id);
    }
    async createProfile(userId) {
        const profileCreateInput = await this.generateProfileCreateInputWithDefault(userId);
        return this.prisma.profile.create({
            data: profileCreateInput,
            select: {
                id: true,
                userId: true,
            },
        });
    }
    async deleteProfileById(profileId) {
        return this.prisma.profile.delete({
            where: {
                id: profileId,
            },
            select: {
                id: true,
                userId: true,
            },
        });
    }
    async updateProfileSelf(profileId, profile) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: profile.getPublicSelf(),
            select: { id: true, userId: true },
        });
    }
    //
    // CREDENTIAL
    //
    async queryUpdateCredential(where, credential) {
        return this.prisma.credential.update({
            where: where,
            data: credential.getPublic(),
            select: {
                id: true,
                profileId: true,
            },
        });
    }
    async updateCredentialByProfileId(profileId, credential) {
        return this.queryUpdateCredential({
            profileId: profileId,
        }, credential);
    }
    async updateCredentialById(id, credential) {
        return this.queryUpdateCredential({
            id: id,
        }, credential);
    }
    //
    // SOCIAL_MEDIAS
    //
    async generateSocialMediaNodesCreateManyInput(profileId, socialMediaNodes) {
        const createManyInput = socialMediaNodes.map((node) => {
            const variantId = node.socialMediaVariant.id;
            if (!variantId)
                throw new Error('variantId is not defined');
            return {
                ...node.getPublicSelf(),
                profileId: profileId,
                variantId: variantId,
            };
        });
        return createManyInput;
    }
    async findSocialMediaNodesNestedByProfileId(profileId) {
        const queried = await this.prisma.socialMediaNode.findMany({
            where: {
                profileId: profileId,
            },
            include: { socialMediaVariant: true },
        });
        return queried.map((node) => {
            return new socialMediaNode_entity_1.SocialMediaNodeEntity(node);
        });
    }
    async findSocialMediaNodesUniqueFieldsByProfileId(profileId) {
        const queried = await this.prisma.socialMediaNode.findMany({
            where: {
                profileId: profileId,
            },
            select: { profileId: true, variantId: true },
        });
        return queried;
    }
    async findExistedSocialMediaNodes(socialMediaNodeIds) {
        const queried = await this.prisma.socialMediaNode.findMany({
            where: { id: { in: socialMediaNodeIds } },
            include: { socialMediaVariant: true },
        });
        return queried.map((node) => new socialMediaNode_entity_1.SocialMediaNodeEntity(node));
    }
    async queryCreateManySocialMediaNodes(createManyInput) {
        return this.prisma.socialMediaNode.createMany({
            data: createManyInput,
            skipDuplicates: true,
        });
    }
    async deleteSocialMediasByProfileId(profileId) {
        return this.prisma.socialMediaNode.deleteMany({
            where: { profileId: profileId },
        });
    }
    async updateSocialMedias(profileId, socialMediaNodes) {
        try {
            const createInput = await this.generateSocialMediaNodesCreateManyInput(profileId, socialMediaNodes);
            const deleteResult = await this.deleteSocialMediasByProfileId(profileId);
            const createResult = await this.queryCreateManySocialMediaNodes(createInput);
            return createResult;
        }
        catch (e) {
            if (e instanceof Error)
                throw new common_1.BadRequestException(e.message);
            throw new common_1.BadRequestException();
        }
    }
    //
    // SOCIAL_MEDIAS_VARIANTS
    //
    async queryExistedSocialMediaVariantsByNames(names, select = null) {
        return this.prisma.socialMediaVariant.findMany({
            select: select,
            where: {
                name: {
                    in: names,
                },
            },
            orderBy: {
                name: profiles_1.Prisma.SortOrder.asc,
            },
        });
    }
    async findExistedSocialMediaVariantIdsByNames(names) {
        const queried = await this.queryExistedSocialMediaVariantsByNames(names, {
            id: true,
        });
        return queried.map((variant) => variant.id);
    }
    async findExistedSocialMediaVariantNamesByNames(names) {
        const queried = await this.queryExistedSocialMediaVariantsByNames(names, {
            id: true,
        });
        return queried.map((variant) => variant.name);
    }
    async findExistedSocialMediaVariantsByNames(names) {
        const queried = await this.queryExistedSocialMediaVariantsByNames(names);
        return queried.map((variant) => {
            return new socialMediaVariant_entity_1.SocialMediaVariantEntity(variant);
        });
    }
    async createSocialMediaVariants(variants) {
        return this.prisma.socialMediaVariant.createMany({
            data: variants.map((variant) => variant.getPublic()),
            skipDuplicates: true,
        });
    }
    //
    // Utility
    //
    async isProfilePublic(profileId) {
        const queried = await this.prisma.publicProfile.findUnique({
            where: { profileId: profileId },
        });
        return !!queried;
    }
    async findManyPublicProfileIdsByUserId(userId) {
        const queried = await this.prisma.publicProfile.findMany({
            where: { profile: { userId: userId } },
            select: { profileId: true },
        });
        return queried.map((node) => node.profileId);
    }
};
exports.ProfilesRepository = ProfilesRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProfilesRepository);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var PrismaService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const profiles_1 = __webpack_require__(11);
let PrismaService = exports.PrismaService = PrismaService_1 = class PrismaService extends profiles_1.PrismaClient {
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
/* 11 */
/***/ ((module) => {

module.exports = require("@prisma/client/profiles");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileEntity = void 0;
const credential_entity_1 = __webpack_require__(13);
const socialMediaNode_entity_1 = __webpack_require__(14);
class ProfileEntity {
    constructor(profile) {
        this.id = profile.id;
        this.userId = profile.userId;
        this.socialMediaNodes = profile.socialMediaNodes?.map((socialMedia) => {
            return new socialMediaNode_entity_1.SocialMediaNodeEntity(socialMedia);
        });
        if (profile.credential)
            this.credential = new credential_entity_1.CredentialEntity(profile.credential);
    }
    getPublicSelf() {
        return {
            userId: this.userId,
        };
    }
    getPublicNested() {
        return {
            userId: this.userId,
            socialMediaNodes: this.socialMediaNodes?.map((SocialMediaEntity) => SocialMediaEntity.getPublicNested()),
            credential: this.credential?.getPublic(),
        };
    }
    getSocialMediasEntity() {
        return this.socialMediaNodes;
    }
    getCredentialsEntity() {
        return this.credential;
    }
}
exports.ProfileEntity = ProfileEntity;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CredentialEntity = void 0;
class CredentialEntity {
    constructor(credential) {
        this.id = credential.id;
        this.profileId = credential.profileId;
        this.firstName = credential.firstName;
        this.lastName = credential.lastName;
        this.birthday = credential.birthday;
    }
    getPublic() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            birthday: this.birthday,
        };
    }
}
exports.CredentialEntity = CredentialEntity;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialMediaNodeEntity = void 0;
const socialMediaVariant_entity_1 = __webpack_require__(15);
class SocialMediaNodeEntity {
    constructor(socialMedia) {
        this.id = socialMedia.id;
        this.profileId = socialMedia.profileId;
        this.socialMediaVariant = new socialMediaVariant_entity_1.SocialMediaVariantEntity(socialMedia.socialMediaVariant);
        this.isActive = socialMedia.isActive;
        this.link = socialMedia.link;
    }
    getPublicSelf() {
        return {
            isActive: this.isActive,
            link: this.link,
        };
    }
    getPublicNested() {
        return {
            socialMediaVariant: this.socialMediaVariant.getPublic(),
            isActive: this.isActive,
            link: this.link,
        };
    }
}
exports.SocialMediaNodeEntity = SocialMediaNodeEntity;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialMediaVariantEntity = void 0;
class SocialMediaVariantEntity {
    constructor(socialMediaVariant) {
        this.id = socialMediaVariant.id;
        this.iconUrl = socialMediaVariant.iconUrl;
        this.name = socialMediaVariant.name;
    }
    getPublic() {
        return {
            iconUrl: this.iconUrl,
            name: this.name,
        };
    }
}
exports.SocialMediaVariantEntity = SocialMediaVariantEntity;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const profiles_repository_1 = __webpack_require__(9);
const entities_utility_1 = __webpack_require__(17);
// import { IProfileDefaults } from '@konstantin-serebryakov-pet-nodejs/interfaces';
let ProfileService = exports.ProfileService = class ProfileService {
    constructor(profilesRepository) {
        this.profilesRepository = profilesRepository;
    }
    async generateProfileDefault(userId) {
        return this.profilesRepository.generateProfileDefault(userId);
    }
    async createProfile(userId) {
        return this.profilesRepository.createProfile(userId);
    }
    async updateProfile(profileId, profile) {
        if (profile.socialMediaNodes) {
            await this.updateSocialMediaNodes(profileId, profile.socialMediaNodes);
        }
        if (profile.credential) {
            await this.updateCredential(profileId, profile.credential);
        }
        const profileUpdateResult = await this.profilesRepository.updateProfileSelf(profileId, profile);
        return profileUpdateResult;
    }
    async updateCredential(profileId, credential) {
        return this.profilesRepository.updateCredentialByProfileId(profileId, credential);
    }
    async synchronizeSocialMediaNodesVariantsWithDatabase(socialMediaNodes) {
        const variantNames = await (0, entities_utility_1.extractSocialMediaVariantsNames)(socialMediaNodes);
        const storedVariants = await this.profilesRepository.findExistedSocialMediaVariantsByNames(variantNames);
        socialMediaNodes.forEach((node) => {
            const storedVariant = storedVariants.find((variant) => variant.name === node.socialMediaVariant.name);
            if (!storedVariant)
                throw new Error('socialMediaVariant not found');
            node.socialMediaVariant = storedVariant;
        });
    }
    async updateSocialMediaNodes(profileId, socialMediaNodes) {
        const variants = await (0, entities_utility_1.extractSocialMediaVariants)(socialMediaNodes);
        await this.appendSocialMediasVariants(variants);
        await this.synchronizeSocialMediaNodesVariantsWithDatabase(socialMediaNodes);
        return this.profilesRepository.updateSocialMedias(profileId, socialMediaNodes);
    }
    async appendSocialMediasVariants(variants) {
        const names = variants.map((variant) => variant.name);
        const existedNames = await this.profilesRepository.findExistedSocialMediaVariantNamesByNames(names);
        const notExisted = variants.filter((variant) => !existedNames.includes(variant.name));
        // TODO: uncomment
        // await this.iconsService.fillSocialMediaVariantIcons(notExisted);
        return this.profilesRepository.createSocialMediaVariants(notExisted);
    }
    //
    // UTILITY
    //
    async isProfilePublic(profileId) {
        return this.profilesRepository.isProfilePublic(profileId);
    }
    async validateProfileQueryPermission(profileId, userId) {
        const isPublic = await this.isProfilePublic(profileId);
        if (isPublic)
            return true;
        const isUserAllowed = await this.validateProfileEditPermission(userId, profileId);
        if (isUserAllowed)
            return true;
        throw new common_1.UnauthorizedException();
    }
    async validateProfileEditPermission(userId, profileId) {
        const profile = await this.profilesRepository.findProfileNestedById(profileId);
        if (profile.userId !== userId)
            throw new common_1.UnauthorizedException();
        return true;
    }
    async getDefaultProfileId(userId) {
        return this.profilesRepository.findProfileDefaultId(userId);
    }
};
exports.ProfileService = ProfileService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof profiles_repository_1.ProfilesRepository !== "undefined" && profiles_repository_1.ProfilesRepository) === "function" ? _a : Object])
], ProfileService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractSocialMediaVariantsNames = exports.extractSocialMediaVariantsPublic = exports.extractSocialMediaVariants = exports.extractSocialMediaNodesPublicNested = exports.extractSocialMediaNodesPublicSelf = void 0;
//
// SOCIAL MEDIA NODE
//
async function extractSocialMediaNodesPublicSelf(socialMediaNodes) {
    return socialMediaNodes.map((node) => {
        return node.getPublicSelf();
    });
}
exports.extractSocialMediaNodesPublicSelf = extractSocialMediaNodesPublicSelf;
async function extractSocialMediaNodesPublicNested(socialMediaNodes) {
    return socialMediaNodes.map((node) => {
        return node.getPublicNested();
    });
}
exports.extractSocialMediaNodesPublicNested = extractSocialMediaNodesPublicNested;
//
// SOCIAL MEDIA VARIANT
//
async function extractSocialMediaVariants(socialMediaNodes) {
    return socialMediaNodes.map((node) => {
        return node.socialMediaVariant;
    });
}
exports.extractSocialMediaVariants = extractSocialMediaVariants;
async function extractSocialMediaVariantsPublic(socialMediaNodes) {
    return socialMediaNodes.map((node) => {
        return node.socialMediaVariant.getPublic();
    });
}
exports.extractSocialMediaVariantsPublic = extractSocialMediaVariantsPublic;
async function extractSocialMediaVariantsNames(socialMediaNodes) {
    return socialMediaNodes.map((node) => {
        return node.socialMediaVariant.name;
    });
}
exports.extractSocialMediaVariantsNames = extractSocialMediaVariantsNames;


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesCommands = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_rmq_1 = __webpack_require__(6);
const contracts_1 = __webpack_require__(19);
const profiles_repository_1 = __webpack_require__(9);
const porfiles_service_1 = __webpack_require__(16);
const profile_entity_1 = __webpack_require__(12);
let ProfilesCommands = exports.ProfilesCommands = class ProfilesCommands {
    constructor(profileService, profileRepository) {
        this.profileService = profileService;
        this.profileRepository = profileRepository;
    }
    async createProfile({ userId }) {
        return this.profileService.createProfile(userId);
    }
    async changeProfile({ userId, profileId, profile }) {
        const isEditPermitted = await this.profileService.validateProfileEditPermission(userId, profileId);
        if (!isEditPermitted)
            throw new common_1.UnauthorizedException();
        const profileEntity = new profile_entity_1.ProfileEntity(profile);
        profileEntity.userId = userId;
        return this.profileService.updateProfile(profileId, profileEntity);
    }
    async changeProfileDefault({ userId, profile }) {
        const profileId = await this.profileService.getDefaultProfileId(userId);
        const profileEntity = new profile_entity_1.ProfileEntity(profile);
        profileEntity.userId = userId;
        return this.profileService.updateProfile(profileId, profileEntity);
    }
    async deleteProfile({ userId, profileId }) {
        const isEditPermitted = await this.profileService.validateProfileEditPermission(userId, profileId);
        if (!isEditPermitted)
            throw new common_1.UnauthorizedException();
        return this.profileRepository.deleteProfileById(profileId);
    }
};
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileCreateOne.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof contracts_1.ProfileCreateOne !== "undefined" && contracts_1.ProfileCreateOne.Request) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ProfilesCommands.prototype, "createProfile", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileChange.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof contracts_1.ProfileChange !== "undefined" && contracts_1.ProfileChange.Request) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ProfilesCommands.prototype, "changeProfile", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileChangeDefault.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_g = typeof contracts_1.ProfileChangeDefault !== "undefined" && contracts_1.ProfileChangeDefault.Request) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ProfilesCommands.prototype, "changeProfileDefault", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileDeleteOne.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_j = typeof contracts_1.ProfileDeleteOne !== "undefined" && contracts_1.ProfileDeleteOne.Request) === "function" ? _j : Object]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ProfilesCommands.prototype, "deleteProfile", null);
exports.ProfilesCommands = ProfilesCommands = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof porfiles_service_1.ProfileService !== "undefined" && porfiles_service_1.ProfileService) === "function" ? _a : Object, typeof (_b = typeof profiles_repository_1.ProfilesRepository !== "undefined" && profiles_repository_1.ProfilesRepository) === "function" ? _b : Object])
], ProfilesCommands);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(5);
//
// accounts
//
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
//
// profiles
//
tslib_1.__exportStar(__webpack_require__(26), exports);
tslib_1.__exportStar(__webpack_require__(27), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(35), exports);
tslib_1.__exportStar(__webpack_require__(36), exports);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountLogin = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 21 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountRegister = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountChangeUserInfo = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountQueryUserInfo = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUserCreatedEvent = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileCreateOne = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileDeleteOne = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChange = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileQuery = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileQueryDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileQueryUserProfilesIds = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeCredential = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeCredentialDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeSocialMediaNodes = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileChangeSocialMediaNodesDefault = void 0;
const tslib_1 = __webpack_require__(5);
const class_validator_1 = __webpack_require__(21);
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
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesQueries = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_rmq_1 = __webpack_require__(6);
const contracts_1 = __webpack_require__(19);
const profiles_repository_1 = __webpack_require__(9);
const porfiles_service_1 = __webpack_require__(16);
// query default
// query
// query profiles IDS
let ProfilesQueries = exports.ProfilesQueries = class ProfilesQueries {
    constructor(profileRepository, profileService) {
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }
    async getProfileDefault({ userId }) {
        const profileEntity = await this.profileRepository.findProfileDefaultNested(userId);
        return {
            profile: profileEntity,
        };
    }
    async getProfile({ userId, profileId }) {
        await this.profileService.validateProfileQueryPermission(profileId, userId);
        const profileEntity = await this.profileRepository.findProfileNestedById(profileId);
        return {
            profile: profileEntity,
        };
    }
    async getProfilesIdsForUser({ userId }) {
        const ids = await this.profileRepository.findManyProfileIdsByUserId(userId);
        return {
            profileIds: ids,
        };
    }
};
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileQueryDefault.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof contracts_1.ProfileQueryDefault !== "undefined" && contracts_1.ProfileQueryDefault.Request) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ProfilesQueries.prototype, "getProfileDefault", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileQuery.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_e = typeof contracts_1.ProfileQuery !== "undefined" && contracts_1.ProfileQuery.Request) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ProfilesQueries.prototype, "getProfile", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileQueryUserProfilesIds.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_g = typeof contracts_1.ProfileQueryUserProfilesIds !== "undefined" && contracts_1.ProfileQueryUserProfilesIds.Request) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ProfilesQueries.prototype, "getProfilesIdsForUser", null);
exports.ProfilesQueries = ProfilesQueries = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof profiles_repository_1.ProfilesRepository !== "undefined" && profiles_repository_1.ProfilesRepository) === "function" ? _a : Object, typeof (_b = typeof porfiles_service_1.ProfileService !== "undefined" && porfiles_service_1.ProfileService) === "function" ? _b : Object])
], ProfilesQueries);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(10);
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
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesEvents = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_rmq_1 = __webpack_require__(6);
const contracts_1 = __webpack_require__(19);
const porfiles_service_1 = __webpack_require__(16);
let ProfilesEvents = exports.ProfilesEvents = class ProfilesEvents {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async userCreated({ userId }) {
        this.profileService.generateProfileDefault(userId);
    }
};
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountUserCreatedEvent.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.AccountUserCreatedEvent !== "undefined" && contracts_1.AccountUserCreatedEvent.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProfilesEvents.prototype, "userCreated", null);
exports.ProfilesEvents = ProfilesEvents = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof porfiles_service_1.ProfileService !== "undefined" && porfiles_service_1.ProfileService) === "function" ? _a : Object])
], ProfilesEvents);


/***/ }),
/* 40 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IconsService = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const axios_1 = __webpack_require__(40);
// import { IProfileDefaults } from '@konstantin-serebryakov-pet-nodejs/interfaces';
let IconsService = exports.IconsService = class IconsService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findIconURL(term) {
        //TODO: fetch api for icon url
        throw new common_1.NotImplementedException();
    }
    async fillSocialMediaVariantIcons(variants) {
        throw new common_1.NotImplementedException();
        for (const variant of variants) {
            variant.iconUrl = await this.findIconURL(variant.name);
        }
    }
};
exports.IconsService = IconsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], IconsService);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfilesNestedCommands = void 0;
const tslib_1 = __webpack_require__(5);
const common_1 = __webpack_require__(2);
const nestjs_rmq_1 = __webpack_require__(6);
const porfiles_service_1 = __webpack_require__(16);
const credential_entity_1 = __webpack_require__(13);
const contracts_1 = __webpack_require__(19);
const socialMediaNode_entity_1 = __webpack_require__(14);
let ProfilesNestedCommands = exports.ProfilesNestedCommands = class ProfilesNestedCommands {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async changeCredential({ profileId, userId, credential }) {
        const isEditPermitted = await this.profileService.validateProfileEditPermission(userId, profileId);
        if (!isEditPermitted)
            throw new common_1.UnauthorizedException();
        const credentialEntity = new credential_entity_1.CredentialEntity(credential);
        return this.profileService.updateCredential(profileId, credentialEntity);
    }
    async changeCredentialDefault({ userId, credential }) {
        const profileId = await this.profileService.getDefaultProfileId(userId);
        const credentialEntity = new credential_entity_1.CredentialEntity(credential);
        return this.profileService.updateCredential(profileId, credentialEntity);
    }
    async changeSocialMediaNodes({ profileId, userId, socialMediaNodes, }) {
        const isEditPermitted = await this.profileService.validateProfileEditPermission(userId, profileId);
        if (!isEditPermitted)
            throw new common_1.UnauthorizedException();
        const socialMediaNodesEntities = socialMediaNodes.map((node) => new socialMediaNode_entity_1.SocialMediaNodeEntity(node));
        return this.profileService.updateSocialMediaNodes(profileId, socialMediaNodesEntities);
    }
    async changeSocialMediaNodesDefault({ userId, socialMediaNodes }) {
        const profileId = await this.profileService.getDefaultProfileId(userId);
        const socialMediaNodesEntities = socialMediaNodes.map((node) => new socialMediaNode_entity_1.SocialMediaNodeEntity(node));
        return this.profileService.updateSocialMediaNodes(profileId, socialMediaNodesEntities);
    }
};
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileChangeCredential.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.ProfileChangeCredential !== "undefined" && contracts_1.ProfileChangeCredential.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ProfilesNestedCommands.prototype, "changeCredential", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileChangeCredentialDefault.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof contracts_1.ProfileChangeCredentialDefault !== "undefined" && contracts_1.ProfileChangeCredentialDefault.Request) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ProfilesNestedCommands.prototype, "changeCredentialDefault", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileChangeSocialMediaNodes.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_f = typeof contracts_1.ProfileChangeSocialMediaNodes !== "undefined" && contracts_1.ProfileChangeSocialMediaNodes.Request) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ProfilesNestedCommands.prototype, "changeSocialMediaNodes", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.ProfileChangeSocialMediaNodesDefault.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_h = typeof contracts_1.ProfileChangeSocialMediaNodesDefault !== "undefined" && contracts_1.ProfileChangeSocialMediaNodesDefault.Request) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], ProfilesNestedCommands.prototype, "changeSocialMediaNodesDefault", null);
exports.ProfilesNestedCommands = ProfilesNestedCommands = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof porfiles_service_1.ProfileService !== "undefined" && porfiles_service_1.ProfileService) === "function" ? _a : Object])
], ProfilesNestedCommands);


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
    await app.init();
    common_1.Logger.log(`🚀 Profiles microservice is running`);
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map