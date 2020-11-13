import { CommentsEntity } from 'src/comments/comments.entity';
import { PostsEntity } from 'src/posts/posts.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class UsersEntity {

    @PrimaryColumn('varchar', { length: 20 })
    username: string;

    @Column('varchar', { nullable: false })
    hashedPassword: string;

    @Column('boolean', { default: false, nullable: false})
    isModerator: boolean;

    @OneToMany(
        type => PostsEntity,
        posts => posts.username,
    )
    posts: PostsEntity[];

    @OneToMany(
        type => CommentsEntity,
        comments => comments.commentId,
    )
    comments: CommentsEntity[];
    
}