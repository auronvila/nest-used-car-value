import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import any = jasmine.any;

interface ClassConstructor {
  new(...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // run something before the request is handled by the request handler


    return next.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }

}