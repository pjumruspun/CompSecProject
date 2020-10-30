import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  require('dotenv').config({ path: __dirname + '/.env'})
  await app.listen(process.env.BACKEND_SERVICE_PORT);
}
bootstrap();
