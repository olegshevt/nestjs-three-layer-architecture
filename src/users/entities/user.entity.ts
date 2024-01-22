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
import { ApiKey } from '../../iam/api-key/entities/api-key.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @Column({ default: false })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ nullable: true })
  googleId: string;

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[];

  //In production app should be a different Permissions table with many-to-many to Users.
  //Should not use the role and Permission the same time, just demonstration for Role-based and
  //Permission-based (Claims-based) authorization.
  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];
}
