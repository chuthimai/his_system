import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ROLES } from 'src/constants/roles';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/test')
  test() {
    return 'OKE';
  }

  @Get('/user-test')
  async userTest() {
    return await this.usersService.findOne(1303869943);
  }

  @Get('/staff-test')
  async staffTest() {
    return await this.usersService.findOneStaff(1303869943);
  }

  @Get('/physician-test')
  async physicianTest() {
    return await this.usersService.findOnePhysician(1303869943);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/search')
  async search(@Query('name') name: string) {
    return await this.usersService.search(name);
  }
}
