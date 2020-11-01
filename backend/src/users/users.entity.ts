import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class UsersEntity {

    @PrimaryColumn('varchar', { length: 20 })
    username: string;

    @Column('varchar', { nullable: false })
    hashedPassword: string;

    @Column('boolean', { default: false, nullable: false})
    isModerator: boolean;

}