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
import { Payment } from './payment.entity';
import { ReservationLog } from './reservationLog.entity';
import { User } from './user.entity';

@Entity({ name: 'reservation' })
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  no: number;

  @Column('datetime', { comment: '예약 일자 및 시간' })
  @Index('reserved_at')
  reserved_at: Date;

  @Column('int', { comment: '예약 인원 수' })
  num_of_people: number;

  @Column('int', { comment: '예약 가격' })
  price: number;

  @Column('boolean', { comment: '취소여부', default: false })
  is_canceled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('varchar', { length: 100, default: null, comment: '예약자' })
  name: string;

  @Column('varchar', { length: 20, default: null, comment: '예약자 전화번호' })
  phone_number: string;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User; // 해당 회원

  @OneToMany(() => Payment, (payment) => payment.reservation)
  payments: Payment[]; // 결제 내역

  @OneToMany(() => ReservationLog, (log) => log.target)
  logs: ReservationLog[]; // 로그

  static async findByNo(no: number) {
    return this.findOne({ where: { no: no }, relations: ['payments'] });
  }
}
