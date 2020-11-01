import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityRepository, Repository, UpdateResult } from 'typeorm';
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

    async update(postsEntity: PostsEntity): Promise<UpdateResult> {
        return await this.postsRepository.update(String(postsEntity.postId), postsEntity);
    }

    async delete(postId: string): Promise<DeleteResult> {
        return await this.postsRepository.delete(postId);
    }

    async isOwnedBy(postId: string, username: string): Promise<boolean> {
        const postsEntity = await this.postsRepository.findOne({ postId: postId });
        return String(postsEntity.username) === username;
    }
}
