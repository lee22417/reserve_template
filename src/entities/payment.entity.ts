import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity({ name: 'pay' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  no: number;

  @Column('int', { nullable: false, comment: '해당 결제건 결제 금액' })
  partial_price: number;

  @Column('varchar', { length: 20, comment: '결제 유형' })
  method: string;

  @Column('varchar', { length: 100, comment: '결제 카드사/은행명' })
  bank: string;

  @Column('boolean', { comment: '취소 여부' })
  @Index('is_canceled')
  is_canceled: boolean;

  @Column('boolean', { comment: '결제 성공 여부' })
  is_succeeded: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Reservation, (reservation) => reservation.payments)
  reservation: Reservation;
}
