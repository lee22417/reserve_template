import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(userId, createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':no')
  findOne(@Param('no') no: string) {
    return this.reservationService.findOne(+no);
  }

  @Patch(':no')
  update(@Param('no') no: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(+no, updateReservationDto);
  }

  @Delete(':no')
  remove(@Param('no') no: string) {
    return this.reservationService.cancel(+no);
  }
}
