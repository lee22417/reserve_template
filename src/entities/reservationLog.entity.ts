import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { User } from './user.entity';

@Entity({ name: 'reservation_log' })
export class ReservationLog extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  no: number;

  @Column('varchar', { length: 100, nullable: false, comment: '변경된 컬럼' })
  column: string;

  @Column('varchar', { length: 255, nullable: false, comment: '변경 전 값' })
  old_row: string;

  @Column('varchar', { length: 255, nullable: false, comment: '변경 후 값' })
  row: string;

  @Column('varchar', { length: 100, nullable: false, comment: '책임자' })
  charge_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Reservation, (reservation) => reservation.logs)
  target: Reservation; // 해당하는 reservation

  static async createAndSave(
    column: string,
    old_row: string,
    row: string,
    charge_id: string,
    reservation: Reservation,
  ) {
    const log = new ReservationLog();
    log.column = column;
    log.old_row = old_row;
    log.row = row;
    log.charge_id = charge_id;
    log.target = reservation;
    return await log.save();
  }
}
