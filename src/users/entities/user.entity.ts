/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permission.type';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  //In production app should be a different Permissions table with many-to-many to Users.
  //Should not use the role and Permission the same time, just demonstration for Role-based and
  //Permission-based (Claims-based) authorization.
  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];
}
