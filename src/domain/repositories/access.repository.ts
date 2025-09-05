import { AccessEntity } from '@domain/entities/access.entity';

export abstract class IAccessRepository {
  abstract findById(id: number): Promise<AccessEntity | void>;
  abstract findByEmailAndCompanyId(
    email: string,
    companyId: number,
  ): Promise<AccessEntity | void>;
  abstract findByUserIdAndCompanyId(
    userId: number,
    companyId: number,
  ): Promise<AccessEntity | void>;
}
