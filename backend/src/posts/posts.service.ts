import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';

@EntityRepository(PostsEntity)
export class PostsEntityRepository extends Repository<PostsEntity> {}

@Injectable()
export class PostsService {
    constructor(@InjectRepository(PostsEntity) private postsRepository: PostsEntityRepository) {}

    async findAll(): Promise<PostsEntity[]> {
        return await this.postsRepository.find();
    }

    async create(postsEntity: PostsEntity): Promise<PostsEntity> {
        return await this.postsRepository.save(postsEntity);
    }
}
