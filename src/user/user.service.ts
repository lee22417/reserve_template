import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CommonAuth } from 'src/common/common.auth';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const sameId = await this.userRepository.findOne({ id: createUserDto.id });
    if (sameId && !sameId.is_quit) {
      // signed in id, not leaved
      throw new ForbiddenException({ status: HttpStatus.BAD_REQUEST, msg: 'Already existed id' });
    }
    if (sameId && sameId.is_quit) {
      // signed in , but leaved before
      // delete old account
      await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id: sameId.id });
    }
    // password hashing
    createUserDto.password = await this.hashingPassword(createUserDto.password);
    // create id
    const { password, ...result } = await this.userRepository.save(createUserDto);
    return result;
  }

  async findAll() {
    return await this.userRepository.find({ select: ['id', 'name'] });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id, is_quit: false },
      select: ['id', 'name'],
    });
  }

  async update(no: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(no, updateUserDto);
  }

  async quit(id: string) {
    const user = await this.findOne(id);
    user.is_quit = true;
    this.userRepository.save(user);
    return true;
  }

  async hashingPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
