import { CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }

    if (request.currentUser.isAdmin === false) {
      throw new HttpException('Only the administrator can change the contracts state', HttpStatus.BAD_REQUEST);
    }

    return request.currentUser.isAdmin;
  }
}
