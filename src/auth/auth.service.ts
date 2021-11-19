import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(verifyAuthDto: VerifyAuthDto): Promise<any> {
    const user = await User.findById(verifyAuthDto.id);
    if (user) {
      const isMatched = await bcrypt.compare(verifyAuthDto.password, user.password);
      if (isMatched) return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id };
    const accessToken = await this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      expiresIn: '3600',
    };
  }

  async decodeToken(token) {
    try {
      const bearerToken: string = token.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(bearerToken);
      console.log(payload);
      return payload;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
