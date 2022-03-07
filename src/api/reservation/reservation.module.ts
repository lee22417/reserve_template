import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from 'src/entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CommonAuth } from 'src/common/common.auth';
import { CommonFormat } from 'src/common/common.format';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User])],
  providers: [ReservationService, CommonAuth, CommonFormat],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
