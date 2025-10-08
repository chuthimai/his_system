import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ROLES } from 'src/constants/others';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PHYSICIAN)
  @Get('/search/by-name')
  async searchByName(@Query('name') name: string) {
    return await this.usersService.searchByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.PATIENT)
  @Get('/physicians-by-specialty/:specialtyIdentifier')
  async getPhysicianBySpecialty(
    @Param('specialtyIdentifier') specialtyIdentifier: number,
  ) {
    return await this.usersService.findAllPhysicianBySpecialty(
      specialtyIdentifier,
    );
  }
}
