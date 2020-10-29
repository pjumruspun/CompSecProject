import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'p@ssw0rd',
      database: 'compsecproject',
      entities: [],
      synchronize: true,
      insecureAuth: true,
    }),
  ],
  controllers: [AppController, UsersController, PostsController, CommentsController],
  providers: [AppService],
})
export class AppModule {}
