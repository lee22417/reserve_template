import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
      // joined id, not quit
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Already existed id',
      });
    }
    if (sameId && sameId.is_quit) {
      // joined id, quit, can not use id currently
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Already existed id',
      });
      // delete old account
      // await this.userRepository
      //   .createQueryBuilder()
      //   .delete()
      //   .from(User)
      //   .where('id = :id', { id: sameId.id });
      //
    }
    // password hashing
    createUserDto.password = await this.hashingPassword(createUserDto.password);
    // create id
    const { password, ...result } = await this.userRepository.save(createUserDto);
    return result;
  }

  async findAll() {
    return await this.userRepository.find({ select: ['id', 'name'], where: { is_quit: false } });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id, is_quit: false },
      select: ['id', 'name'],
    });
  }

  async update(no: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.id) {
      return await this.userRepository.update(no, updateUserDto);
    } else {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Id can not be updated',
      });
    }
  }

  async quit(id: string) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ is_quit: true })
      .where('id = :id', { id: id })
      .execute();
    return true;
  }

  async hashingPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
