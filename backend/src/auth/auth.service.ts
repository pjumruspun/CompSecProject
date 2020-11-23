import { Injectable, Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EasyconfigModule } from 'nestjs-easyconfig';
var bcrypt = require('bcryptjs')

@Module({
    imports: [EasyconfigModule.register({ path: '.env' })],
})
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if(!user) {
            console.log('Cannot find user')
            return false
        }
        const match = bcrypt.compareSync(password, user.hashedPassword);
        console.log(match);
        if(user && match) { 
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

    public static hashPasswordSync(password: string) {
        return bcrypt.hashSync(password, Number(process.env.HASHING_ROUNDS));
    }
}
