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

  async findAll() {
    return await this.rRepository.find({ relations: ['user', 'payments'] });
  }

  // find by pk
  async findOne(no: number) {
    return await this.rRepository.findOne({ where: { no: no }, relations: ['user', 'payments'] });
  }

  // find by user id
  async findByUserId(userId: number) {
    return await this.rRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'payments'],
    });
  }

  //TODO reservation date

  async update(no: number, updateReservationDto: UpdateReservationDto) {
    return await this.rRepository.update(no, updateReservationDto);
  }

  async cancel(no: number) {
    const user = await this.findOne(no);
    user.is_canceled = true;
    this.userRepository.save(user);
    return true;
  }
}
