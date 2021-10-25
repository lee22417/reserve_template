import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  no: number;

  @Column('varchar', { length: 20, unique: true })
  @Index('it_id')
  id: string;

  @Column('varchar', { length: 100 })
  @Index('dt_id')
  name: string;

  @Column('varchar', { length: 255 })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  static async createAndSave(id: string, name: string, password: string) {
    const user = new User();
    user.id = id;
    user.name = name;
    user.password = password;
  }
}
