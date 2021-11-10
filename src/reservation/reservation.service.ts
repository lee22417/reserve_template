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
    reservation.user = await this.userRepository.findOne({ id: userId });
    await reservation.save();
    return reservation;
  }

  async findAll() {
    return await this.rRepository.find();
  }

  // find by pk
  async findOne(no: number) {
    return await this.rRepository.findOne({ no: no });
  }

  //TODO find by user id, reservation date

  async update(no: number, updateReservationDto: UpdateReservationDto) {
    return await this.rRepository.update(no, updateReservationDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} reservation`;
  // }
}
