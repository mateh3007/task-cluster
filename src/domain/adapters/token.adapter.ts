export interface TokenPayload {
  id: number;
  resetPassword?: boolean;
}

export abstract class TokenAdapter {
  abstract getPayloadFromToken(token: string): Promise<TokenPayload | null>;
  abstract generateToken(payload: TokenPayload): Promise<string>;
}
