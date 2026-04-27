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
  //Metodo Login
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
    const userPermissions = user.role?.permissions?.map(p => p.permission) || [];
    if (!user.role) {
      throw new UnauthorizedException('El usuario no tiene un rol asignado');
    }
    const payload = { sub: user.id, email: user.email, role: user.role.role, permissions: userPermissions };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); 

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        permissions: userPermissions
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
  async refresh(refreshToken: string) {
    try {
      // Verificamos que el refresh token sea válido y no haya expirado de esos 7 días
      const payload = this.jwtService.verify(refreshToken);

      // Si es válido, sacamos los datos y creamos un Access Token nuevecito
      const newPayload = { sub: payload.sub, email: payload.email };
      
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
        // Opcional: podrías devolver también un refresh token nuevo aquí si quieres
      };
    } catch (e) {
      // Si el refresh token expiró o es inventado, lo botamos
      throw new UnauthorizedException('Refresh token inválido o expirado. Vuelve a iniciar sesión.');
    }
  }

}