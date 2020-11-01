import { Injectable } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';

@EntityRepository(UsersEntity)
export class UsersEntityRepository extends Repository<UsersEntity> {}

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private usersRepository: UsersEntityRepository) {}

    async findAll(): Promise<UsersEntity[]> {
        return await this.usersRepository.find();
    }

    async findByUsername(username: string): Promise<UsersEntity> {
        return await this.usersRepository.findOne({ username: username });
    }

    // Create, update, delete users: Do it through DB directly?
}
