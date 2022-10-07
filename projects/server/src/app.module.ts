import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './services/config/config';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class AppModule {}
