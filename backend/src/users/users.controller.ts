import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll(): Promise<UsersEntity[]> {
        return this.usersService.findAll();
    }
}
