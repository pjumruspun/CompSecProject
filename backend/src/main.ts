import { NestFactory } from '@nestjs/core';
import { ALL } from 'dns';
import { AppModule } from './app.module';
import { UsersController } from './users/users.controller'

async function bootstrap() {
  const ALLOW_ORIGIN = ["*:3000",, "http://localhost:3000","http://compsecproject_frontend_1:3001","http://compsecproject_frontend_1"]

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:ALLOW_ORIGIN
  })
  require('dotenv').config({ path: __dirname + '/.env'})
  await app.listen(process.env.BACKEND_SERVICE_PORT);
}
bootstrap();
