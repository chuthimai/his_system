import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { ROLES } from 'src/common/constants/others';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';
import { UsersService } from 'src/modules/users/users.service';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { role } = loginDto;
    const user =
      role === ROLES.PATIENT
        ? await this.usersService.findOne(loginDto.identifier, true)
        : await this.usersService.findOnePhysician(loginDto.identifier, true);

    if (!user || !user.role || !(user.role === role)) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password as string,
    );
    if (!isValidPassword) {
      throw new HttpExceptionWrapper(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    const payload = { id: user.identifier, role: user.role };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }
}
