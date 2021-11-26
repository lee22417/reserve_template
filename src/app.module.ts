import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonFormat } from './common/common.format';
import { ReservationModule } from './reservation/reservation.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { CommonAuth } from './common/common.auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      //host : docker 실행 후 docker inspect로 해당 container의 ip를 찾아서 입력
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [join(__dirname, 'entities/*.entity.{ts,js}')],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommonFormat, CommonAuth],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'auth/login',
        { path: 'user', method: RequestMethod.POST },
        { path: 'reservation', method: RequestMethod.GET },
      )
      .forRoutes('/');
  }
}
