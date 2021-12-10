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
  HttpException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CommonAuth } from 'src/common/common.auth';
import { type } from 'os';
import { UnauthorizedException } from '@nestjs/common';

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
    throw new UnauthorizedException();
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
      return this.reservationService.findAll(isAdmin);
    }
    throw new UnauthorizedException();
  }

  @Get(':no')
  findOne(@Param('no') no: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can search reservation information
      return this.reservationService.findOne(+no);
    }
    throw new UnauthorizedException();
  }

  @Patch(':no')
  update(@Param('no') no: string, @Body() updateReservationDto: UpdateReservationDto, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can update reservation information
      return this.reservationService.update(+no, updateReservationDto);
    }
    throw new UnauthorizedException();
  }

  @Delete(':no')
  remove(@Param('no') no: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can cancel reservation
      return this.reservationService.cancel(+no);
    }
    throw new UnauthorizedException();
  }
}
