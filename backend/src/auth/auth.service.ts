import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hash, fullName);
    return this.signToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.signToken(user.id, user.email);
  }

  private signToken(sub: string, email: string) {
    return { access_token: this.jwtService.sign({ sub, email }) };
  }
}