import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() payload: RegisterUserDto, @Res() res: Response) {
        const result = this.authService.register(payload);
        return res.send({ message: result })
    }

    @Post('login')
    async login(@Body() payload: LoginUserDto, @Res() res: Response) {
        const result = this.authService.login(payload);
        return res.send({ message: result })
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        const result = this.authService.logout();
        return res.send({ message: result })
    }
}
