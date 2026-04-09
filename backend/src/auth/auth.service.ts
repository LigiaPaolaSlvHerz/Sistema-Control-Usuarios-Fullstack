import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const user = await this.usersService.findOneByLogin(identifier);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const esEmailCorrecto = (user.email === identifier);
    const esUsernameCorrecto = (user.username === identifier);

    if (!esEmailCorrecto && !esUsernameCorrecto) {
      throw new UnauthorizedException('Credenciales no coinciden');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password incorrecto');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    };
  }
  async register(userData: any) {
    const newUserWithRole = {
      ...userData,
      role_id: 8 
    };
  // Aquí llamas a tu otro servicio que ya está configurado
  return await this.usersService.create(newUserWithRole);
  }
}