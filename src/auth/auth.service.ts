import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: LoginDto, forPhysician: true) {
    const user = await this.userService.findOne(loginDto.identifier);

    if (!user || (forPhysician && user?.role !== 'PHYSICIAN')) {
      throw new HttpException('User not existed', HttpStatus.BAD_REQUEST);
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    // if (!isValidPassword) {
    //   throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    // }

    const payload = { id: user.identifier, name: user.name };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }
}
