import { Body, Controller, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Query('role') role: string, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, role);
  }
}
