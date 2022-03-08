import { HttpStatus, Injectable } from '@nestjs/common';
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

  async create(reservationNo: number, createPaymentDto: CreatePaymentDto) {
    // get releated reservation
    const reservation = await Reservation.findByNo(reservationNo);
    if (!reservation || reservation.is_canceled) {
      return { statusCode: HttpStatus.BAD_REQUEST, msg: ' No Reservation Exist' };
    } else {
      // if payment exist and not canceled
      if (reservation.payments) {
        // cumulate price, calculate remained price
        const remainPrice = reservation.payments.reduce((acc, cur, idx) => {
          return (acc -= cur.price);
        }, reservation.price);
        // check price
        if (remainPrice < createPaymentDto.price) {
          return { statusCode: HttpStatus.BAD_REQUEST, msg: 'Not Valid Price' };
        }
      }
    }

    // save
    const payment = await this.pRepository.save(createPaymentDto);
    // connect to reservation
    payment.reservation = reservation;
    await this.pRepository.save(payment);
    delete payment.reservation;
    return { statusCode: HttpStatus.OK, payment: payment };
  }

  // find list by is_refund
  async findRefund(isRefund: string = null) {
    const payments = await Payment.findRefund(isRefund);
    return { statusCode: HttpStatus.OK, payments: payments };
  }

  // refund payment
  async refund(no: number, chargeId: string) {
    const payment = await Payment.findByNo(no);
    // update is_refund as true
    payment.is_refund = true;
    payment.refund_at = new Date();
    payment.log = payment.log += 'refund approval : ' + chargeId;
    await this.pRepository.save(payment);
    return { statusCode: HttpStatus.OK, msg: 'Success' };
  }
}
