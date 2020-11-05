import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class PostsEntity {

    @PrimaryGeneratedColumn("uuid")
    postId: string;

    @Column('varchar', { nullable: false })
    content: string;

    @Column('timestamp', { nullable: false, default: () => "NOW()" })
    publishedTime: Timestamp;

    @Column('varchar', { length: 20, nullable: false })
    @ManyToOne(
        type => UsersEntity,
        username => username.posts, {
            // Delete user -> all their posts are gone
            // Can easily be changed if needed
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    )
    username: UsersEntity;

}