import { Entity, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity()
export class Access extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accesses)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Company, (company) => company.accesses)
  company: Company;

  @Column()
  companyId: number;
}
