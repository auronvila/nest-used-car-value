import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReportsEntity } from '../reports/reports.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => ReportsEntity, (report) => report.user)
  reports: ReportsEntity[];
}
