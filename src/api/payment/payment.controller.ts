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
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonAuth } from 'src/common/common.auth';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';

@Controller('payment')
@ApiTags('결제정보 API')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly commonAuth: CommonAuth,
  ) {}

  @Post(':reservation_no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '결제내역 생성 API',
    description:
      '해당 id의 결제내역 생성 (해당 id와 토큰 id 확인), 관리자의 경우 모든 결제내역 생성 가능',
  })
  async create(
    @Param('reservation_no') reservationNo: number,
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req,
  ) {
    const user = await User.findByReservationNo(reservationNo);
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, user.no);
    if (isAllowed) {
      return await this.paymentService.create(reservationNo, createPaymentDto);
    }
    throw new UnauthorizedException();
  }

  @Patch(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '결제내역 업데이트 API',
    description: '해당 id의 결제내역 업데이트, 관리자만 결제내역 업데이트 가능',
  })
  async update(@Param('no') no: number, @Body() updatePaymentDto: UpdatePaymentDto, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // return this.paymentService.update(+id, updatePaymentDto);
    }
  }
}
