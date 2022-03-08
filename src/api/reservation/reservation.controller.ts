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

  @Post(':user_no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '예약생성 API',
    description:
      '해당 no의 예약생성 (해당 no와 토큰 no확인), 관리자의 경우 모든 예약 정보 생성 가능',
  })
  async create(
    @Param('user_no') userNo: number,
    @Body() createReservationDto: CreateReservationDto,
    @Req() req,
  ) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, userNo);
    if (isAllowed) {
      return await this.reservationService.create(
        userNo,
        createReservationDto,
        req.app.locals.payload.id,
      );
    }
    throw new UnauthorizedException();
  }

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
  async findAll(@Req() req, @Query('user') user: number, @Query('date') date) {
    // search option : date | userId
    if (date) {
      // get reservations by date
      return this.reservationService.findByDate(date);
    } else if (user) {
      const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, user);
      if (isAllowed) {
        // admin or userself can see target user
        return await this.reservationService.findByUserNo(user);
      }
    } else {
      const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
      return await this.reservationService.findAll(isAdmin);
    }
    throw new UnauthorizedException();
  }

  @Get(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '예약리스트 API', description: '관리자가 해당 예약리스트 확인' })
  async findOne(@Param('no') no: number, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can search reservation
      return await this.reservationService.findByNo(no);
    }
    throw new UnauthorizedException();
  }

  @Patch(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '예약 업데이트 API', description: '관리자가 해당 예약 업데이트 확인' })
  async update(
    @Param('no') no: number,
    @Body() updateReservationDto: UpdateReservationDto,
    @Req() req,
  ) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can update reservation
      return await this.reservationService.update(
        no,
        updateReservationDto,
        req.app.locals.payload.id,
      );
    }
    throw new UnauthorizedException();
  }

  @Patch('/cancel/:no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '예약 취소 API', description: '관리자가 해당 예약 취소 확인' })
  async remove(@Param('no') no: number, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // only admin can cancel reservation
      return await this.reservationService.cancel(no, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }
}
