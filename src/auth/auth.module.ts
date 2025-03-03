import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { TokenBlacklistService } from './blacklist.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }],
    )
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenBlacklistService],
  exports:[TokenBlacklistService]
})
export class AuthModule { }
