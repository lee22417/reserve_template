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
import { type } from 'os';

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
  findAll(@Req() req, @Query('user') user: string, @Query('date') date) {
    // search option : date | userId
    if (date) {
      return this.reservationService.findByDate(date);
    } else if (user) {
      const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, user);
      if (isAllowed) {
        // admin or userself can see information
        return this.reservationService.findByUserId(user);
      }
    } else {
      const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
      // only admin can see all reservation
      if (isAdmin) {
        return this.reservationService.findAll(isAdmin);
      }
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Get(':no')
  findOne(@Param('no') no: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can search reservation information
      return this.reservationService.findOne(+no);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Patch(':no')
  update(@Param('no') no: string, @Body() updateReservationDto: UpdateReservationDto, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can update reservation information
      return this.reservationService.update(+no, updateReservationDto);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Delete(':no')
  remove(@Param('no') no: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can cancel reservation
      return this.reservationService.cancel(+no);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }
}
