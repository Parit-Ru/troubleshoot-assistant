import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.constants';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByEmail(email: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] ?? null;
  }

  async create(email: string, passwordHash: string, fullName?: string) {
    const result = await this.pool.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at`,
      [email, passwordHash, fullName ?? null],
    );
    return result.rows[0];
  }
}