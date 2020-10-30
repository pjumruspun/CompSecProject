"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const posts_controller_1 = require("./posts/posts.controller");
const comments_controller_1 = require("./comments/comments.controller");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const typeorm_2 = require("typeorm");
const users_module_1 = require("./users/users.module");
const nestjs_easyconfig_1 = require("nestjs-easyconfig");
let AppModule = class AppModule {
    constructor(connection) {
        this.connection = connection;
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            nestjs_easyconfig_1.EasyconfigModule.register({ path: '.env' }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.TYPEORM_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.TYPEORM_USERNAME,
                password: process.env.DB_ROOT_PASSWORD,
                database: process.env.DB_NAME,
                entities: [path_1.join(__dirname, '**/*.entity{.ts,.js}')],
                synchronize: true,
                insecureAuth: true,
            }),
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController, posts_controller_1.PostsController, comments_controller_1.CommentsController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [typeorm_2.Connection])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map