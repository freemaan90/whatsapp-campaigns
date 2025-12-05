// http-request.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpRequestService } from './http-request.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [HttpRequestService],
  exports: [HttpRequestService],
})
export class HttpRequestModule {}