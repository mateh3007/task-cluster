import { Entity, ManyToOne, Column, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('accesses')
@Unique(['email', 'companyId'])
export class Access extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  companyId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Company, (company) => company.accesses)
  company: Company;

  @ManyToOne(() => User, (user) => user.accesses)
  user: User;
}
