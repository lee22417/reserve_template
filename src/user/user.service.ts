import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    const { password, ...result } = await this.userRepository.save(createUserDto);
    return result;
  }

  async findAll() {
    return await this.userRepository.find({ select: ['id', 'name'] });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne({ id: id }, { select: ['id', 'name'] });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getHashPw(password: string): Promise<string> {
    const hashPassword = await this.userRepository.query(
      `SELECT PASSWORD('` + password + `') as password`,
    );
    console.log(hashPassword);
    return hashPassword[0]['password'];
  }
}
