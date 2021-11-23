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
    const isExist = await this.userRepository.findOne({ id: createUserDto.id });
    if (isExist) {
      throw new ForbiddenException({ status: HttpStatus.FORBIDDEN, msg: 'Already existed id' });
    }
    // password hashing
    createUserDto.password = await this.hashingPassword(createUserDto.password);
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
