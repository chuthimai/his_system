import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ROLES } from 'src/constants/roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/patient')
  patientLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/login/physician')
  physicianLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, ROLES.PHYSICIAN);
  }
}
