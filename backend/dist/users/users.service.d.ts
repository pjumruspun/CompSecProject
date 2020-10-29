import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
export declare class UsersEntityRepository extends Repository<UsersEntity> {
}
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: UsersEntityRepository);
    findAll(): Promise<UsersEntity[]>;
}
