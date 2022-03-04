import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from 'src/entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { CommonAuth } from 'src/common/common.auth';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Reservation])],
  controllers: [PaymentController],
  providers: [PaymentService, CommonAuth],
})
export class PaymentModule {}
