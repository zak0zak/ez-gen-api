import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenBlacklistService } from './blacklist.service';
import { Error } from 'src/types/Error';
import { ApiResponse } from 'src/types/ApiResponse';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private tokenBlacklistService: TokenBlacklistService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<ApiResponse<User | undefined>> {
        // Check if user with the same email already exists
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email });
            if (!!existingUser)
                throw new ConflictException('Email address already used');

            let encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
            Object.assign(createUserDto, { password: encryptedPassword })
            let newUser = new this.userModel(createUserDto)

            newUser = await newUser.save();

            //Deconstruct & return user data without password
            const { password: _, ...userWithoutPassword } = newUser.toJSON();
            return { data: userWithoutPassword, statusCode: HttpStatus.CREATED, message: "User registered successfully" };
        } catch (error) {
            return {
                error: error.response.message,
                statusCode: error.status,
            }
        }
    }

    async login(LoginUserDto: LoginUserDto): Promise<ApiResponse<string | undefined>> {

        try {
            const user = await this.userModel.findOne({ email: LoginUserDto.email });

            if (!user || !await bcrypt.compare(LoginUserDto.password, user?.password))
                throw new UnauthorizedException({
                    message: 'Incorrect Email or password',
                    statusCode: HttpStatus.UNAUTHORIZED
                });

            //JWT payload
            const payload = { sub: user.id, username: user.username };

            const access_token = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1h',
            })
            return {
                data: access_token,
                statusCode: HttpStatus.OK,
                message: "Generated token successfully"
            };

        } catch (error) {
            return {
                error: error.response.message,
                statusCode: error.response.statusCode,
            }
        }
    }

    logout(token: string) {
        //Add token to blacklist
        //#TODO : Add cron job to clear blacklist every 1 hour 1 min. 
        this.tokenBlacklistService.addToBlacklist(token);
    }
}
