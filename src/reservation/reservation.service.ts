import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation) private rRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const reservation = await this.rRepository.save(createReservationDto);
    // connect reservation to user
    reservation.user = await this.userRepository.findOne({ id: userId });
    this.rRepository.save(reservation);
    return reservation;
  }

  async findAll(isAdmin: boolean = false) {
    if (isAdmin == true) {
      // admin
      return await this.rRepository.find({
        select: ['no', 'reserved_at', 'num_of_people', 'price', 'is_canceled'],
        relations: ['payments'],
      });
    } else {
      // public
      return await this.rRepository.find({
        select: ['no', 'reserved_at', 'is_canceled'],
      });
    }
  }

  // find by pk
  async findOne(no: number) {
    return await this.rRepository.findOne({
      where: { no: no },
      select: ['no', 'reserved_at', 'num_of_people', 'price', 'is_canceled'],
      relations: ['user', 'payments'],
    });
  }

  // find by user id
  async findByUserId(userId: string) {
    //TODO hide user information
    return await this.rRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'payments'],
    });
  }

  // reservation date
  async findByDate(date) {
    return await this.rRepository.find({
      where: { reserved_at: date },
      select: ['no', 'reserved_at', 'is_canceled'],
    });
  }

  async update(no: number, updateReservationDto: UpdateReservationDto) {
    return await this.rRepository.update(no, updateReservationDto);
  }

  async cancel(no: number) {
    const reservation = await this.findOne(no);
    reservation.is_canceled = true;
    await this.rRepository.save(reservation);
    return reservation;
  }
}
