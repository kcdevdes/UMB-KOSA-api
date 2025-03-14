import { Token } from '../../auth/entity/token.entity';
import { BaseEntity } from '../../base/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { USER_ROLE } from './user.role';
import { USER_STATUS } from './user.status';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.ACTIVE })
  status: USER_STATUS;

  @Column({ type: 'text', nullable: true })
  profileImageUrl?: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
