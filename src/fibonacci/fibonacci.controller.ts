import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
// import { FibonacciWorkerHost } from './fibonacci-worker.host';
import Piscina from 'piscina';
import { resolve } from 'path';

@Controller('fibonacci')
export class FibonacciController {
  fibonacciWorker = new Piscina({
    filename: resolve(__dirname, 'fibonacci.worker.js'),
  });
  //   constructor(private readonly fibonacciWorkerHost: FibonacciWorkerHost) {}
  //Run request: curl -X GET -w "\nTime total: %{time_total}s\n" "localhost:3000/fibonacci/?n=41"
  @Public()
  @Get()
  fibonacci(@Query('n') n = 40) {
    // return this.fibonacciWorkerHost.run(n);
    return this.fibonacciWorker.run(n);
  }
}
