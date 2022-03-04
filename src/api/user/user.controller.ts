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
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        data: await this.userService.findAll(),
      };
    }
    throw new UnauthorizedException();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '회원정보 API', description: '해당 id의 화원정보 확인' })
  async findOne(@Param('id') id: string, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, id);
    if (isAllowed) {
      return await this.userService.findOne(id);
    }
    throw new UnauthorizedException();
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 업데이트 API',
    description:
      '해당 id의 화원정보 업데이트 (해당 id와 토큰 id 확인), 관리자의 경우 모든 회원 정보 업데이트 가능',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, id);
    if (isAllowed) {
      return await this.userService.update(id, updateUserDto, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원정보 삭제 API',
    description:
      '해당 id의 화원정보 삭제 (해당 id와 토큰 id 확인), 관리자의 경우 모든 회원 정보 삭제 가능',
  })
  async remove(@Param('id') id: string, @Req() req) {
    const isAllowed = this.commonAuth.isAdminOrUserself(req.app.locals.payload, id);
    if (isAllowed) {
      return await this.userService.quit(id, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }

  @Patch('/admin/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '회원 관리자 권한 부여 API',
    description: '해당 id의 관리자 권한 부여, 관리자만 가능',
  })
  async grantAdmin(@Param('id') id: string, @Req() req) {
    const isAdmin = this.commonAuth.isAdmin(req.app.locals.payload);
    if (isAdmin) {
      return await this.userService.grantAdmin(id, req.app.locals.payload.id);
    }
    throw new UnauthorizedException();
  }
}
