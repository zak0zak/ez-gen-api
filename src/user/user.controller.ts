import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request as Req } from 'express';

@Controller('user')
export class UserController {
    constructor() {
    }

    @Get('')
    @ApiOperation({ summary: 'Access protected route' })
    @ApiResponse({
        status: 200,
        description: 'Access granted to protected route.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized access.',
    })
    @ApiBearerAuth()
    async findAll(@Request() req: Req) {
        console.log(req['user'])
        return req['user']
    }
}
