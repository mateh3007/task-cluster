import { AccessEntity } from '@domain/entities/access.entity';

export abstract class AccessRepository {
  abstract findById(id: number): Promise<AccessEntity | void>;
  abstract findByEmailAndCompanyId(
    email: string,
    companyId: number,
  ): Promise<AccessEntity | void>;
}
