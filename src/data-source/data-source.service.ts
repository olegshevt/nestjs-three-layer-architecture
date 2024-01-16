import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

//durable - we can control life cycle
@Injectable({ scope: Scope.REQUEST, durable: true })
export class DataSourceService {
  constructor(@Inject(REQUEST) private readonly requestContext: unknown) {}
}
