import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async register(payload: CreateUserDto) {
        const existingUser = await this.userModel.findOne({ email: payload.email })
        if (!!existingUser) {
            throw new HttpException("Email already used!", 400);
        }
        const newUser = new this.userModel(payload)
        return await newUser.save()
    }

    login(payload: LoginUserDto) {
        return `Login endpoint`
    }

    logout() {
        return `Logout endpoint`
    }
}
