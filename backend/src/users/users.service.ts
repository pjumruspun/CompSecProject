import { Injectable } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { AuthService } from 'src/auth/auth.service';

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

    // Create must be done through service because of hashing functionality
    // Is there any better way? Feel free to suggest
    async create(usersEntity: UsersEntity): Promise<any> {
        // Technically, usersData.hashedPassword here isn't hashed yet when it's sent through the form
        var hash = AuthService.hashPasswordSync(usersEntity.hashedPassword);
        usersEntity.hashedPassword = hash;

        // Return everything but hashed password
        const createdUser = await this.usersRepository.save(usersEntity);
        const { hashedPassword, ...result } = createdUser;

        return result;
    }

    // Update, delete users: Do it through DB directly?
}
