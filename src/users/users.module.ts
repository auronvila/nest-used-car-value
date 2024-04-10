import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from '../middlewares/current-user.middleware';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
  ],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
