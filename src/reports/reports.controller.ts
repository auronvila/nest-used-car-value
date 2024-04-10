import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user-decorator';
import { UserEntity } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApprovedDto } from './dto/approved.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(@CurrentUser() currentUser: UserEntity, @Body() createReportReq: CreateReportDto) {
    return this.reportService.createReport(createReportReq, currentUser);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') reportId: string, @Body() toggleReportState: ApprovedDto) {
    return this.reportService.changeApproval(reportId, toggleReportState.approved);
  }

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }
}
