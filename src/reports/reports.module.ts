import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsEntity } from './reports.entity';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [TypeOrmModule.forFeature([ReportsEntity])]
})
export class ReportsModule {}
