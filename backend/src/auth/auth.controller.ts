import { Controller, Post, Body } from '@nestjs/common';
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
}