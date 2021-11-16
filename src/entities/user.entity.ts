import { Reservation } from './reservation.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  no: number;

  @Column('varchar', { length: 20, unique: true, comment: '회원 ID' })
  @Index('id')
  id: string;

  @Column('varchar', { length: 100, comment: '회원 이름' })
  @Index('name')
  name: string;

  @Column('varchar', { length: 255, comment: '회원 비밀번호' })
  password: string;

  @Column('varchar', { length: 20, comment: '전화 번호' })
  phone_number: string;

  @Column('varchar', { length: 100, comment: '이메일' })
  email: string;

  @Column('boolean', { default: false, comment: '탈퇴여부' })
  is_quit: boolean;

  @Column('boolean', { default: false, comment: '관리자 여부' })
  is_admin: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  static async createAndSave(id: string, name: string, password: string) {
    const user = new User();
    user.id = id;
    user.name = name;
    user.password = password;
  }

  static async findById(id: string) {
    return this.findOne({ id: id });
  }
}
