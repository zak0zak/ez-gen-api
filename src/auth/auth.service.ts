import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async register(payload: CreateUserDto): Promise<User> {
        // const existingUser = await this.userModel.findOne({ email: payload.email })
        // if (!!existingUser) {
        //     throw new BadRequestException("Email address already used.", {
        //         cause: new Error(),
        //         description: 'Some error description',
        //     });
        // }
        try {
            const newUser = new this.userModel(payload)
            return await newUser.save()
        } catch (e) {
            throw new BadRequestException("Email address already used.", {
                cause: new Error(),
                description: 'Some error description',
            });
        }
    }

    async login(LoginUserDto: LoginUserDto): Promise<{ access_token: string }> {
        const user = await this.userModel.findOne({ email: LoginUserDto.email });
        if (user?.password !== LoginUserDto.password) {
            throw new UnauthorizedException({
                message: 'Incorrect Email or password',
            });
        }
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET
            })
        };
    }

    logout() {
        return `Logout endpoint`
    }
}
