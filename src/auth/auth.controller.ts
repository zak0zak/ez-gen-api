import { Body, Controller, Post, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SkipAuth } from './decorators/SkipAuth.decorator';

@SkipAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() payload: CreateUserDto, @Res() res: Response) {
        const data = await this.authService.register(payload);

        if (data.error)
            return res.send(data);

        return res.status(data.statusCode).send(data)
    }

    @Post('login')
    async login(@Body() payload: LoginUserDto, @Res() res: Response) {
        const data = await this.authService.login(payload);

        if (data.error)
            return res.send(data);

        return res.status(data.statusCode).send({ access_token: data })
    }

    @Post('logout')
    logout(@Body() { token }: { token: string }, @Res() res: Response) {
        this.authService.logout(token);
        res.status(200).send({ message: 'Logged out successfully' });
    }
}
