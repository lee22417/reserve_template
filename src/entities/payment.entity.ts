import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

export enum PaymentMethod {
  CARD = 'CARD',
  BANK = 'BANK', // send via bank
  DEF = 'NULL',
}

@Entity({ name: 'payment' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  no: number;

  @Column('int', { nullable: false, comment: '해당 결제건 결제 금액' })
  price: number;

  @Column('enum', { enum: PaymentMethod, default: PaymentMethod.DEF, comment: '결제 유형' })
  method: PaymentMethod;

  @Column('varchar', { length: 100, default: '', comment: '결제 카드사/은행명' })
  bank: string;

  @Column('boolean', { default: false, comment: '결제 성공 여부' })
  is_succeeded: boolean;

  @Column('boolean', { default: false, comment: '환불 여부' })
  is_refund: boolean;

  @Column('datetime', { default: null, comment: '환불 일자' })
  refund_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('varchar', { length: 255, default: '', comment: '로그' })
  log: string;

  @ManyToOne(() => Reservation, (reservation) => reservation.payments)
  reservation: Reservation;

  static async findByNo(no: number) {
    return this.findOne({ no: no });
  }

  // get payment of canceled reservations
  static async findRefund(is_refund_ori: string) {
    const query: any = {
      where: {
        reservation: { is_canceled: true },
      },
      relations: ['reservation'],
    };
    const is_refund = is_refund_ori ? (is_refund_ori == 'true' ? true : false) : null;
    if (is_refund_ori) {
      query.where.is_refund = is_refund;
    }
    return this.find(query);
  }
}
