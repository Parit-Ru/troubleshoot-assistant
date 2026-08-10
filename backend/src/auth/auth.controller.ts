import { Body, Controller, Post, Get, Res, Req, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return { user: req.user };
  }

  private setCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,           // Render serves HTTPS, so true in production
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}
}