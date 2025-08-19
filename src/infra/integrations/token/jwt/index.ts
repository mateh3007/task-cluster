import { TokenAdapter, TokenPayload } from '@domain/adapters/token.adapter';
import { JwtService as JWT } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

export interface TokenOptions {
  issuer: string;
  secret: string;
  expiresIn?: number;
}

@Injectable()
export class JwtIntegration implements TokenAdapter {
  constructor(private jwt: JWT) {}

  generateToken(payload: TokenPayload, expiresIn?: Date): Promise<string> {
    const options: TokenOptions = {
      issuer: 'task-cluster',
      secret: env.JWT_SECRET!,
    };

    if (expiresIn) {
      options.expiresIn = this.#calculateSecondsUntil(expiresIn);
    }

    return this.jwt.signAsync(payload, options);
  }

  async getPayloadFromToken(token: string): Promise<TokenPayload | null> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não definido');

    try {
      return await this.jwt.verifyAsync<TokenPayload>(token, {
        issuer: 'task-cluster',
        secret,
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  #calculateSecondsUntil(date: Date): number {
    const now = new Date();
    return Math.floor((date.getTime() - now.getTime()) / 1000);
  }
}
