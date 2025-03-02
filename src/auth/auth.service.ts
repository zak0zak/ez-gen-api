import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    register(payload: RegisterUserDto) {
        return `Register endpoint`
    }

    login(payload: LoginUserDto) {
        return `Login endpoint`
    }

    logout() {
        return `Logout endpoint`
    }
}
