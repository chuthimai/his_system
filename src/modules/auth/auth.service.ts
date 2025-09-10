import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/constants/error-messages';
import { ROLES } from 'src/constants/roles';
import { Roles } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: LoginDto, role: string = ROLES.PATIENT) {
    const user =
      role === ROLES.PATIENT
        ? await this.userService.findOne(loginDto.identifier)
        : await this.userService.findOnePhysician(loginDto.identifier);

    if (!user || role !== user?.role || !user.role.endsWith(role)) {
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password as string,
    );

    if (!isValidPassword) {
      throw new HttpException(
        ERROR_MESSAGES.INVALID_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { id: user.identifier, role: user.role };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }
}
