import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':identifier')
  findOne(@Param('identifier') identifier: string) {
    return this.usersService.findOne(+identifier);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  test() {
    return 'OKE';
  }
}
