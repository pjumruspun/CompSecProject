import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async findAll(): Promise<UsersEntity[]> {
        return await this.usersService.findAll();
    }

    @Get(':username')
    async findByUsername(@Param('username') username): Promise<UsersEntity> {
        return await this.usersService.findByUsername(username);
    }
}
