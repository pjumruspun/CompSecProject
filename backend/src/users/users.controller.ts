import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // This should not be available in release	
    @Post('create')	
    async create(@Body() usersData: UsersEntity): Promise<any> {	
        return this.usersService.create(usersData);	
    }
}
