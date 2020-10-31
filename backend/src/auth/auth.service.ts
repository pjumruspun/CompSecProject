import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        
        if(user && user.hashedPassword === password) { // Will perform hash checking later
            const { hashedPassword, ...result } = user;
            return result;
        }

        return null
    }
}
