import { Controller, Get, Request } from '@nestjs/common';
import { Request as Req} from 'express';

@Controller('user')
export class UserController {
    constructor() {
    }

    @Get('')
    async findAll(@Request() req: Req) {
        console.log(req['user'])
    }
}
