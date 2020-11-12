import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from 'src/posts/posts.entity';
import { DeleteResult, EntityRepository, Repository, UpdateResult } from 'typeorm';
import { CommentsEntity } from './comments.entity';

@EntityRepository(CommentsEntity)
export class CommentsEntityRepository extends Repository<CommentsEntity> {}

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsEntity) private commentsRepository: CommentsEntityRepository
    ) {}

    async findAll(): Promise<CommentsEntity[]> {
        return await this.commentsRepository.find();
    }

    async findOne(commentId: string): Promise<CommentsEntity> {
        return await this.commentsRepository.findOne({ commentId: commentId });
    }

    async findByPostId(x: string): Promise<CommentsEntity[]> {
        var allComments = await this.commentsRepository.find();
        var result = [];
        allComments.forEach(comment => {
            if(String(comment.post) == x) {
                result.push(comment);
            }
        });

        // Sort from old to new
        const sorted = result.slice().sort((a, b) => a.publishedTime - b.publishedTime)
        return sorted;
    }

    async create(commentsEntity: CommentsEntity): Promise<CommentsEntity> {
        return await this.commentsRepository.save(commentsEntity);
    }

    async update(commentsEntity: CommentsEntity): Promise<UpdateResult> {
        return await this.commentsRepository.update(String(commentsEntity.commentId), commentsEntity);
    }

    async delete(commentId: string): Promise<DeleteResult> {
        return await this.commentsRepository.delete(commentId);
    }

    async isOwnedBy(commentId: string, username: string): Promise<boolean> {
        const commentsEntity = await this.commentsRepository.findOne({ commentId: commentId });
        return String(commentsEntity.username) === username;
    }
}
