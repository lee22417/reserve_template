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
import { UserLog } from 'src/entities/userLog.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // create user
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

  // find id, name of all users
  async findAll() {
    return await this.userRepository.find({ select: ['id', 'name'], where: { is_quit: false } });
  }

  // find id, name of selected user
  async findOne(no: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { no: no, is_quit: false },
      select: ['id', 'name', 'email', 'phone_number'],
    });
  }

  // update user information
  async update(no: number, updateUserDto: UpdateUserDto, chargeId: string) {
    if (!updateUserDto.id) {
      try {
        const user = await User.findByNo(no);

        // convert dto to plain
        const updateRows = classToPlain(updateUserDto);
        // save update history
        let isLogCreated = false;
        Object.keys(updateRows).map(async (key) => {
          const log = await UserLog.createAndSave(key, user[key], updateRows[key], chargeId, user);
          isLogCreated = log ? true : false;
        });

        // update user information
        await this.userRepository.update(no, updateUserDto);
        return { statusCode: HttpStatus.OK, msg: 'Updated' };
      } catch (e) {
        console.log(e.message);
        console.log(e.body);
        return { statusCode: e.code, msg: e.body };
      }
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Id can not be updated',
      };
    }
  }

  // update user as quit
  async quit(no: number, chargeId: string) {
    try {
      const user = await User.findByNo(no);
      const log = await UserLog.createAndSave(
        'is_quit',
        user.is_quit ? 'true' : 'false',
        'true',
        chargeId,
        user,
      );
      if (log) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ is_quit: true })
          .where('no = :no', { no: no })
          .execute();
        return { statusCode: HttpStatus.OK, msg: 'Success' };
      } else {
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, msg: 'Error occurs' };
      }
    } catch (e) {
      console.log(e.message);
      console.log(e.body);
      return { statusCode: e.code, msg: e.body };
    }
  }

  // update user authority as admin
  async grantAdmin(no: number, chargeId: string) {
    try {
      // save who give authority
      const user = await User.findByNo(no);
      const log = await UserLog.createAndSave(
        'is_admin',
        user.is_admin ? 'true' : 'false',
        'true',
        chargeId,
        user,
      );
      if (log) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ is_admin: true })
          .where('no = :no', { no: no })
          .execute();
        return { statusCode: HttpStatus.OK, msg: 'Updated' };
      }
    } catch (e) {
      console.log(e.message);
      console.log(e.body);
      return { statusCode: e.code, msg: e.body };
    }
  }

  // ---- internal ---

  // hasing password when save
  async hashingPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
