import { PostsEntity } from "src/posts/posts.entity";
import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class CommentsEntity {

    @PrimaryGeneratedColumn("uuid")
    commentId: string;

    @Column('varchar', { nullable: false })
    content: string;

    @Column('timestamp', { nullable: false, default: () => "NOW()" })
    publishedTime: Timestamp;

    @Column('varchar', { length: 20, nullable: false })
    @ManyToOne(
        type => UsersEntity,
        username => username.posts, {
            // Delete user -> all their comments are gone
            // Can easily be changed if needed
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    )
    username: UsersEntity;

    @Column('varchar', { nullable: false })
    @ManyToOne(
        type => PostsEntity,
        post => post.postId, {
            // Delete post -> all the post's comments are gone
            // I don't think this needs to be changed?
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    )
    post: PostsEntity;
    
}