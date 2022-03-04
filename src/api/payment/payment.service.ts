import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Reservation) private rRepository: Repository<Reservation>,
    @InjectRepository(Payment) private pRepository: Repository<Payment>,
  ) {}

  async create(reservationNo, createPaymentDto: CreatePaymentDto) {
    const payment = await this.pRepository.save(createPaymentDto);
    // connect to reservation
    payment.reservation = await Reservation.findByNo(reservationNo);
    await this.pRepository.save(payment);
    delete payment.reservation;
    return payment;
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
