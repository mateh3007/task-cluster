import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Address } from './address.entity';
import { Access } from './access.entity';

@Entity()
export class Company extends BaseEntity {
  @Column()
  tradeName: string;

  @Column()
  corporateName: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  cnpj: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Address, (address) => address.company)
  addresses: Address[];

  @OneToMany(() => Access, (access) => access.company)
  accesses: Access[];
}
