import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // This should not be available in release
    @Get()
    async findAll(): Promise<UsersEntity[]> {
        return await this.usersService.findAll();
    }

    // This should not be available in release
    @Get('findbyusername/:username')
    async findByUsername(@Param('username') username): Promise<UsersEntity> {
        return await this.usersService.findByUsername(username);
    }

    // This should not be available in release
    @Post('create')
    async create(@Body() usersData: UsersEntity): Promise<any> {
        return this.usersService.create(usersData);
    }
}
