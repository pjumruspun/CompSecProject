import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: '.env' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.DB_ROOT_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**/*.entity{.ts,.js}')],
      synchronize: true,
      insecureAuth: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, PostsController, CommentsController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
