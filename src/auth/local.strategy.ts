import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'id' });
  }

  async validate(verifyAuthDto: VerifyAuthDto): Promise<any> {
    const user = await this.authService.validateUser(verifyAuthDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
