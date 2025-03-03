
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDto {


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
    @IsString()
    @IsNotEmpty()
    password: string;

}