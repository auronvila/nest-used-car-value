import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity';
import { ReportsEntity } from './reports/reports.entity';
import { LoggingMiddleware } from './logger/loggerMiddleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
    ReportsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [UserEntity, ReportsEntity],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [UserEntity, ReportsEntity],
    //   synchronize: true,
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
