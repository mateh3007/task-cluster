import { AddressableEnum } from '../enums/addressable.enum';
import { BaseEntity } from './base.entity';

export interface AddressEntity extends BaseEntity {
  addressableType: AddressableEnum;
  addressableId: number;
  country: string;
  uf: string;
  city: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
}
