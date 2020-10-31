import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async findAll(): Promise<UsersEntity[]> {
        return await this.usersService.findAll();
    }

    @Get('findbyusername/:username')
    async findByUsername(@Param('username') username): Promise<UsersEntity> {
        return await this.usersService.findByUsername(username);
    }

    @Post('create')
    async create(@Body() usersData: UsersEntity): Promise<any> {
        return this.usersService.create(usersData);
    }
}
