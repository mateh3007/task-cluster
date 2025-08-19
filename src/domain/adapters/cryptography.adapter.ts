export abstract class CryptographyAdapter {
  abstract compare(plainText: string, encryptText: string): Promise<boolean>;
  abstract generateHash(plain: string): Promise<string>;
}
