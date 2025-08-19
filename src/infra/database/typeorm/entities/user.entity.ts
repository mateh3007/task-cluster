import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { Access } from './access.entity';
import { Task } from './task.entity';

@Entity()
export class User extends BaseEntity {
  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @Column()
  companyId: number;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  registration: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Access, (access) => access.user)
  accesses: Access[];
}
