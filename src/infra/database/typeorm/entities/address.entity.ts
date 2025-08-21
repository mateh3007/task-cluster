import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { AddressableEnum } from 'src/domain/enums/addressable.enum';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ type: 'enum', enum: AddressableEnum })
  addressableType: AddressableEnum;

  @ManyToOne(() => Company, (company) => company.addresses)
  company: Company;

  @Column()
  companyId: number;

  @Column()
  country: string;

  @Column()
  uf: string;

  @Column()
  city: string;

  @Column()
  zipCode: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement?: string;
}
