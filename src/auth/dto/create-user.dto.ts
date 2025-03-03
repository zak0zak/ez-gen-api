import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({
        description: 'The username of the user',
        example: 'zak',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    username: string;

    @ApiProperty({
        description: 'The user email must be unique and valid format',
        example: 'test@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @ApiProperty({
        description: 'Password must be at least 6 chars , 1 uppercase , 1 letter , 1 symbol, 1 lowercase',
        example: 'Test123@',
    })
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    confirmPassword: string;
}
