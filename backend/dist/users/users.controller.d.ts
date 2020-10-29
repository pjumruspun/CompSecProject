import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<UsersEntity[]>;
}
