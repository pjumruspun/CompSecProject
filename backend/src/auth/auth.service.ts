import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);

        if(user && user.hashedPassword === password) { // Will perform hash checking later
            // Return everything but hashedPassword
            const { hashedPassword, ...result } = user;
            return result;
        }

        return null
    }

    async login(user: any) {
        // When using this token, it will yield username and isModerator attributes of the user
        // Hence role checking is possible
        const payload = { username: user.username, isModerator: user.isModerator };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
