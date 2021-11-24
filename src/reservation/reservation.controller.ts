import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CommonAuth } from 'src/common/common.auth';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly commonAuth: CommonAuth,
  ) {}

  @Post()
  create(
    @Query('userId') userId: string,
    @Body() createReservationDto: CreateReservationDto,
    @Req() req,
  ) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, userId);
    if (isAllowed) {
      return this.reservationService.create(userId, createReservationDto);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Get()
  findAll(@Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    return this.reservationService.findAll(isAdmin);
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
