import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.userService.findOne(id);
    const isMatched = await this.userService.matchPassword(id, password);
    if (user && isMatched) {
      return user;
    }
    return false;
  }

  async login(user: any) {
    const payload = { id: user.id };
    const access_token = await this.jwtService.sign(payload);
    return {
      access_token: access_token,
    };
  }
}
