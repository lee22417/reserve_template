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
import CONFIG from 'src/config/common.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // create user
  async create(createUserDto: CreateUserDto) {
    const sameId = await this.userRepository.findOne({ id: createUserDto.id });
    const samePhone = await this.userRepository.findOne({
      phone_number: createUserDto.phone_number,
    });
    if (samePhone) {
      // phone number - unique
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Already Taken Phone Number',
      };
    }
    if (sameId && !sameId.is_quit) {
      // id - exist, not quit
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Already Taken Id',
      };
    }
    if (sameId && sameId.is_quit) {
      // id - exist, quit
      // the id can not be used currently
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Already Taken Id',
      };
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
    return { statusCode: HttpStatus.CREATED, user: result };
  }

  // find id, name of all users
  async findAll() {
    const users = await this.userRepository.find({
      select: ['id', 'name'],
      where: { is_quit: false },
    });
    return { statusCode: HttpStatus.OK, users: users };
  }

  // find id, name of target user
  async findOne(no: number) {
    const user = await this.userRepository.findOne({
      where: { no: no, is_quit: false },
      select: ['id', 'name', 'email', 'phone_number', 'is_admin'],
    });
    return { statusCode: HttpStatus.OK, user: user };
  }

  // update user information
  async update(no: number, updateUserDto: UpdateUserDto, chargeId: string) {
    if (!updateUserDto.id) {
      try {
        const user = await User.findByNo(no);
        // user is valid
        if (user && !user.is_quit) {
          // convert dto to plain
          const updateRows = classToPlain(updateUserDto);
          // save update history in user_log
          Object.keys(updateRows).map(async (key) => {
            await UserLog.createAndSave(key, user[key], updateRows[key], chargeId, user);
          });

          // update in user
          await this.userRepository.update(no, updateUserDto);
          return { statusCode: HttpStatus.OK, msg: 'Updated' };
        } else {
          return { statusCode: HttpStatus.BAD_REQUEST, msg: 'No User Found' };
        }
      } catch (e) {
        console.log(e.message);
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
      // user is valid
      if (user && user.is_quit) {
        const log = await UserLog.createAndSave(
          'is_quit',
          user.is_quit ? CONFIG.LOG.true : CONFIG.LOG.false,
          'true',
          chargeId,
          user,
        );

        // update user.is_quit as true
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ is_quit: true })
          .where('no = :no', { no: no })
          .execute();
        return { statusCode: HttpStatus.OK, msg: 'Success' };
      } else {
        return { statusCode: HttpStatus.BAD_REQUEST, msg: 'No User Found' };
      }
    } catch (e) {
      console.log(e.message);
      return { statusCode: e.code, msg: e.body };
    }
  }

  // update user authority as admin
  async grantAdmin(no: number, chargeId: string) {
    try {
      // save who give authority in user_log
      const user = await User.findByNo(no);
      if (user) {
        const log = await UserLog.createAndSave(
          'is_admin',
          user.is_admin ? CONFIG.LOG.true : CONFIG.LOG.false,
          'true',
          chargeId,
          user,
        );
        // update is_admin as true in user
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ is_admin: true })
          .where('no = :no', { no: no })
          .execute();
        return { statusCode: HttpStatus.OK, msg: 'Updated' };
      } else {
        return { statusCode: HttpStatus.BAD_REQUEST, msg: 'No User Found' };
      }
    } catch (e) {
      console.log(e.message);
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
