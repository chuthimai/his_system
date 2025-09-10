import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ROLES } from 'src/constants/roles';

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
    return await this.usersService.findOne(130386943);
  }

  @Get('/staff-test')
  async staffTest() {
    return await this.usersService.findOneStaff(1303869943);
  }

  @Get('/physician-test')
  async physicianTest() {
    return await this.usersService.findOnePhysician(130369943);
  }
}
