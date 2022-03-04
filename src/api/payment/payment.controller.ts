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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonAuth } from 'src/common/common.auth';
import { Reservation } from 'src/entities/reservation.entity';

@Controller('payment')
@ApiTags('결제정보 API')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly commonAuth: CommonAuth,
  ) {}

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Post(':reservation_no')
  @ApiOperation({
    summary: '결제내역 생성 API',
    description:
      '해당 id의 결제내역 생성 (해당 id와 토큰 id 확인), 관리자의 경우 모든 결제내역 생성 가능',
  })
  async create(
    @Param('reservation_no') reservationNo,
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req,
  ) {
    const reservation = await Reservation.findByNo(reservationNo);
    const isAllowed = this.commonAuth.isAdminOrUserself(
      req.app.locals.payload,
      reservation.user.id,
    );
    if (isAllowed) {
      return await this.paymentService.create(reservationNo, createPaymentDto);
    }
    throw new UnauthorizedException();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
