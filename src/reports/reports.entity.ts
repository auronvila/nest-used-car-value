import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'reports' })
export class ReportsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => UserEntity, (user) => user.reports)
  user: UserEntity;
}
