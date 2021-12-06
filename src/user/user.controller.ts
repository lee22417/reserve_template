import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonAuth } from 'src/common/common.auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly commonAuth: CommonAuth) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    // only admin can access
    if (isAdmin) {
      return { statusCode: HttpStatus.OK, msg: 'Success', data: await this.userService.findAll() };
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, id);
    if (isAllowed) {
      return await this.userService.findOne(id);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, id);
    if (isAllowed) {
      return await this.userService.update(id, updateUserDto);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, id);
    if (isAllowed) {
      return await this.userService.quit(id);
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, msg: 'Unauthorized' };
  }
}
