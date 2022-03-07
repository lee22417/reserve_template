import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CommonAuth } from 'src/common/common.auth';
import { type } from 'os';
import { UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('reservation')
@ApiTags('예약정보 API')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly commonAuth: CommonAuth,
  ) {}

  @Get()
  @ApiOperation({ summary: '예약리스트 API' })
  @ApiQuery({
    name: 'date',
    description: '해당 날짜로 예약정보 확인 (토큰 X)',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'user',
    description: '해당 회원 No로 예약정보 확인 (토큰 확인), 관리자의 경우 모든 예약정보 확인 가능',
    type: 'string',
    required: false,
  })
  findAll(@Req() req, @Query('user') user: number, @Query('date') date) {
    // search option : date | userId
    if (date) {
      return this.reservationService.findByDate(date);
    } else if (user) {
      const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, user);
      if (isAllowed) {
        // admin or userself can see information
        return this.reservationService.findByUserNo(user);
      }
    } else {
      const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
      return this.reservationService.findAll(isAdmin);
    }
    throw new UnauthorizedException();
  }

  @Post(':user_no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '예약생성 API',
    description:
      '해당 id의 예약생성 (해당 id와 토큰 id 확인), 관리자의 경우 모든 예약 정보 생성 가능',
  })
  create(
    @Param('user_no') userNo: number,
    @Body() createReservationDto: CreateReservationDto,
    @Req() req,
  ) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, userNo);
    if (isAllowed) {
      return this.reservationService.create(userNo, createReservationDto);
    }
    throw new UnauthorizedException();
  }

  @Get(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '예약리스트 API', description: '관리자가 해당 예약리스트 확인' })
  findOne(@Param('no') no: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can search reservation information
      return this.reservationService.findOne(+no);
    }
    throw new UnauthorizedException();
  }

  @Patch(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '예약 업데이트 API', description: '관리자가 해당 예약 업데이트 확인' })
  update(@Param('no') no: string, @Body() updateReservationDto: UpdateReservationDto, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can update reservation information
      return this.reservationService.update(+no, updateReservationDto);
    }
    throw new UnauthorizedException();
  }

  @Delete(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '예약 취소 API', description: '관리자가 해당 예약 취소 확인' })
  remove(@Param('no') no: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can cancel reservation
      return this.reservationService.cancel(+no);
    }
    throw new UnauthorizedException();
  }
}
