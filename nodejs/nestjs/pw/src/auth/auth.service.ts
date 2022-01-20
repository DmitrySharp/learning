import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as EmailValidator from 'email-validator';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const md5sum = crypto.createHash('md5');
        const passHash = md5sum.update(pass).digest('hex');
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password === passHash) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, id: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async create(name: string, email: string, password: string, passwordConfirmation: string) {
        if(name === "")
            throw new Error("Name field is required");
        if(email === "")
            throw new Error("Email field is required");
        if(password === "")
            throw new Error("Password field is required");
        if(!EmailValidator.validate(email))
            throw new Error("Provided invalid email");
        if(password != passwordConfirmation)
            throw new Error("Password not equal to confirmation password");
        const md5sum = crypto.createHash('md5');
        const passHash = md5sum.update(password).digest('hex');
        await this.usersService.create(name, email, passHash);
    }
}