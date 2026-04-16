import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body) {
    const identifier = body.email || body.username;
    return this.authService.login(identifier, body.password);
  }
  @Post('register')
  async register(@Body() createUserDto: any) {
  return this.authService.register(createUserDto);
  }
  @Post('refresh')
  refreshTokens(@Body() body: { refresh_token: string }) {
    if (!body.refresh_token) {
      // Un pequeño filtro por si Angular manda vacío el campo
      throw new UnauthorizedException('Se requiere el refresh token');
    }
    return this.authService.refresh(body.refresh_token);
  }
}