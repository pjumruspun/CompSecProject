"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    require('dotenv').config({ path: __dirname + '/.env' });
    await app.listen(process.env.BACKEND_SERVICE_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map