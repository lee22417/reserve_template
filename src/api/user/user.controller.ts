import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonAuth } from 'src/common/common.auth';
import { UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('회원정보 API')
export class UserController {
  constructor(private readonly userService: UserService, private readonly commonAuth: CommonAuth) {}

  @Post()
  @ApiOperation({ summary: '회원가입 API' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '회원정보 API', description: '관리자 토큰으로 회원정보 확인' })
  async findAll(@Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    // only admin can access
    if (isAdmin) {
      // get all the user information
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        data: await this.userService.findAll(),
      };
    }
    throw new UnauthorizedException();
  }

  @Get(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '회원정보 API', description: '해당 no의 화원정보 확인' })
  async findOne(@Param('no') no: number, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, no);
    if (isAllowed) {
      // get target [no] user information
      return await this.userService.findOne(no);
    }
    throw new UnauthorizedException();
  }

  @Patch(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 업데이트 API',
    description:
      '해당 id의 화원정보 업데이트 (해당 id와 토큰 id 확인), 관리자의 경우 모든 회원 정보 업데이트 가능',
  })
  async update(@Param('no') no: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, no);
    if (isAllowed) {
      // update target user information
      return await this.userService.update(no, updateUserDto, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }

  @Delete(':no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 삭제 API',
    description:
      '해당 id의 화원정보 삭제 (해당 id와 토큰 id 확인), 관리자의 경우 모든 회원 정보 삭제 가능',
  })
  async remove(@Param('no') no: number, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, no);
    if (isAllowed) {
      // update target user status as quit
      return await this.userService.quit(no, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }

  @Patch('/admin/:no')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원 관리자 권한 부여 API',
    description: '해당 id의 관리자 권한 부여, 관리자만 가능',
  })
  async grantAdmin(@Param('no') no: number, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      // grant admin access to target user
      return await this.userService.grantAdmin(no, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }
}
