import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(@InjectRepository(Reservation) private rRepository: Repository<Reservation>) {}

  create(createReservationDto: CreateReservationDto) {
    return 'This action adds a new reservation';
  }

  async findAll() {
    return await this.rRepository.find();
  }

  // find by pk
  async findOne(no: number) {
    return await this.rsvRepository.findOne({ no: no });
  }

  //TODO find by user id, reservation date

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} reservation`;
  // }
}
