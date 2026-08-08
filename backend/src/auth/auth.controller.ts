import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; fullName?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.register(
      body.email,
      body.password,
      body.fullName,
    );
    this.setCookie(res, token);
    return { user };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(body.email, body.password);
    this.setCookie(res, token);
    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { success: true };
  }

  private setCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set true in production (requires HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JwtModule's expiresIn
      path: '/',
    });
  }
}