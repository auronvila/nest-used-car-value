import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReportsEntity } from './reports.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UserEntity } from '../users/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(ReportsEntity) private reportsRepository: Repository<ReportsEntity>) {
  }

  async createReport(createReportReq: CreateReportDto, userEntity: UserEntity) {
    const report = this.reportsRepository.create(createReportReq);
    report.user = userEntity;

    return this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new HttpException('The report with gived id was not found', HttpStatus.NOT_FOUND);
    }
    report.approved = approved;
    return await this.reportsRepository.save(report);
  }

  async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.reportsRepository.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('LOWER(make)= LOWER(:make)')
      .andWhere('LOWER(model)= LOWER(:model)')
      .andWhere('lng - :lng BETWEEN -3 AND 3')
      .andWhere('lat - :lat BETWEEN -3 AND 3')
      .andWhere('year - :year BETWEEN -3 AND 3')
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ make, model, lng, lat, year, mileage })
      .limit(3)
      .getRawOne();
  }
}
