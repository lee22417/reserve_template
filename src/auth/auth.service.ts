import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(id: string, password: string): Promise<any> {
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      const isMatched = await bcrypt.compare(password, user.password);
      if (isMatched) return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id };
    const access_token = await this.jwtService.sign(payload);
    return {
      access_token: access_token,
    };
  }
}
