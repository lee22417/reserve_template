import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // authorize user
  async validateUser(verifyAuthDto: VerifyAuthDto): Promise<any> {
    const user = await User.findById(verifyAuthDto.id);
    if (user && !user.is_quit) {
      const isMatched = await bcrypt.compare(verifyAuthDto.password, user.password);
      if (isMatched) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  // login - get JWT token
  async getToken(user: any) {
    const payload = { id: user.id, is_admin: user.is_admin };
    const accessToken = await this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      expiresIn: '3600',
    };
  }

  // decode JWT token
  async decodeToken(token) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // check either customer or admin
  async isAdmin(token) {
    try {
      const payload = await this.decodeToken(token);
      if (payload && payload.is_admin) {
        return payload.is_admin;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
