import { CryptographyAdapter } from '@domain/adapters/cryptography.adapter';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptIntegration implements CryptographyAdapter {
  private HASH_SALT_LENGTH = 8;

  async generateHash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }
}
