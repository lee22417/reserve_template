import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_log' })
export class UserLog extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.reservations)
  target: User;

  static async createAndSave(
    column: string,
    old_row: string,
    row: string,
    charge_id: string,
    user: User,
  ) {
    const log = new UserLog();
    log.column = column;
    log.old_row = old_row;
    log.row = row;
    log.charge_id = charge_id;
    log.target = user;
    return await log.save();
  }
}
