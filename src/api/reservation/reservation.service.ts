import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { User } from 'src/entities/user.entity';
import { ReservationLog } from 'src/entities/reservationLog.entity';
import { CommonFormat } from 'src/common/common.format';
import { classToPlain } from 'class-transformer';
import CONFIG from 'src/config/common.config';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation) private rRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly commonFormat: CommonFormat,
  ) {}

  // create new reservation
  async create(userNo: number, createReservationDto: CreateReservationDto, chargeId: string) {
    // create in reservation
    const reservation = await this.rRepository.save(createReservationDto);
    // create log in reservation log
    await ReservationLog.createAndSave('create', '', '', chargeId, reservation);
    // connect reservation to user
    reservation.user = await User.findByNo(userNo);
    // change format from string to date
    reservation.reserved_at = new Date(reservation.reserved_at);
    await this.rRepository.save(reservation);
    return { statusCode: HttpStatus.CREATED, reservation: reservation };
  }

  // find all reservation
  async findAll(isAdmin: boolean = false) {
    if (isAdmin == true) {
      // admin - get all reservation information
      const reservations = await this.rRepository.find({
        select: ['no', 'reserved_at', 'num_of_people', 'price', 'is_canceled'],
        order: { reserved_at: 'DESC' },
        relations: ['payments'],
      });
      // get remained_price for each reservation
      const reservObj = this.getReservationsWithRemainedPrice(reservations);
      return { statusCode: HttpStatus.OK, reservations: reservObj };
    } else {
      // public
      // get all reservation dates which is valid
      const reservations = await this.rRepository.find({
        select: ['reserved_at'],
        where: { is_canceled: false },
        order: { reserved_at: 'DESC' },
      });
      return { statusCode: HttpStatus.OK, reservations: reservations };
    }
  }

  // find reservation by no
  async findByNo(no: number) {
    const reservation = await this.rRepository.findOne({
      select: ['no', 'reserved_at', 'num_of_people', 'price', 'is_canceled'],
      where: { no: no },
      relations: ['user', 'payments'],
    });
    // get reservation remained_price
    this.getRemainedPrice(reservation);
    // delete user password
    delete reservation.user.password;
    return { statusCode: HttpStatus.OK, reservation: reservation };
  }

  // find reservation by user id
  async findByUserNo(userNo: number) {
    // select reservation with payments
    const reservations = await this.rRepository.find({
      select: ['no', 'reserved_at', 'num_of_people', 'price', 'is_canceled'],
      where: { user: { no: userNo } },
      order: { reserved_at: 'DESC' },
      relations: ['user', 'payments'],
    });
    reservations.map((row) => {
      // delete user information
      delete row.user;
    });
    // get remained_price for each reservation
    const reservObj = this.getReservationsWithRemainedPrice(reservations);
    return { statusCode: HttpStatus.OK, reservations: reservObj };
  }

  // find reservation by date
  async findByDate(date) {
    const fromDate = new Date(date); // from date
    const toDate = this.commonFormat.strtotime(new Date(date), { hour: 24 }); // to date

    // get reservation between from and to date
    const reservations = await this.rRepository
      .createQueryBuilder('r')
      .select('r.reserved_at')
      .where('reserved_at >= :from_date', { from_date: fromDate })
      .andWhere('reserved_at < :to_date', { to_date: toDate })
      .andWhere('is_canceled = :is_canceled', { is_canceled: false })
      .orderBy('reserved_at', 'DESC')
      .getMany();

    return { statusCode: HttpStatus.OK, reservations: reservations };
  }

  // update reservation by no
  async update(no: number, updateReservationDto: UpdateReservationDto, chargeId: string) {
    const reservation = await Reservation.findByNo(no);
    // reservation is valid
    if (reservation && !reservation.is_canceled) {
      // convert dto to plain
      const updateRows = classToPlain(updateReservationDto);
      // save update history in reservation_log
      Object.keys(updateRows).map(async (key) => {
        await ReservationLog.createAndSave(
          key,
          reservation[key],
          updateRows[key],
          chargeId,
          reservation,
        );
      });

      // update in reservation
      await this.rRepository.update(no, updateReservationDto);
      return { statusCode: HttpStatus.OK, msg: 'Updated' };
    } else {
      return { statusCode: HttpStatus.BAD_REQUEST, msg: 'No Reservation Found' };
    }
  }

  // cancel reservation
  async cancel(no: number, chargeId: string) {
    const reservation = await Reservation.findByNo(no);
    if (reservation && !reservation.is_canceled) {
      // create log in reservation log
      await ReservationLog.createAndSave(
        'is_canceled',
        reservation.is_canceled ? CONFIG.LOG.true : CONFIG.LOG.false,
        'true',
        chargeId,
        reservation,
      );
      // update is_canceled as true
      reservation.is_canceled = true;
      await this.rRepository.save(reservation);
      return { statusCode: HttpStatus.OK, msg: 'Updated' };
    } else {
      return { statusCode: HttpStatus.BAD_REQUEST, msg: 'No Reservation Found' };
    }
  }

  // ---- internal ---
  // get remained_price for each reservation
  getReservationsWithRemainedPrice(reservations) {
    // more than one reservations
    if (Array.isArray(reservations)) {
      // change class to objecgt
      const reservObj = classToPlain(reservations);
      // set remained_price for each reservation
      reservObj.map((reservation) => {
        this.getRemainedPrice(reservation);
      });
      return reservObj;
    }
  }

  // get remained_price in reservation
  getRemainedPrice(reservation) {
    // cumulate price, calculate remained price
    reservation.remained_price = reservation.payments.reduce((acc, cur, idx) => {
      return cur.is_refund ? acc : (acc -= cur.price);
    }, reservation.price);
    // get total paid price
    reservation.paid_price = reservation.price - reservation.remained_price;
  }
}
