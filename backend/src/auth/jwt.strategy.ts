import { Injectable, Module } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { EasyconfigModule } from "nestjs-easyconfig";
import { ExtractJwt, Strategy } from "passport-jwt";


@Module({
    imports: [EasyconfigModule.register({ path: '.env' }),]
})
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return { username: payload.username, isModerator: payload.isModerator };
    }
}