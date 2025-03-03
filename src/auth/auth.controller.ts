import { Body, Controller, Post, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SkipAuth } from './decorators/SkipAuth.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@SkipAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Register a new user with email, username, and password.',
    })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully registered.',
        type: CreateUserDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data.',
    })
    async register(@Body() payload: CreateUserDto, @Res() res: Response) {
        const data = await this.authService.register(payload);

        if (data.error)
            return res.send(data);

        return res.status(data.statusCode).send(data)
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user and return an access token' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: 200,
        description: 'Login successful, access token returned.',
        schema: {
            example: { access_token: 'your-jwt-token-here' },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid credentials or missing fields.',
        schema: {
            example: { error: 'Invalid username or password' },
        },
    })
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
