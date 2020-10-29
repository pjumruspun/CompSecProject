import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'p@ssw0rd',
      database: 'compsecproject',
      entities: [join(__dirname, '**/*.entity{.ts,.js}')],
      synchronize: true,
      insecureAuth: true,
    }),
    UsersModule,
  ],
  controllers: [AppController, PostsController, CommentsController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
