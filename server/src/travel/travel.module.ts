import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { ClosetModule } from '../closet/closet.module';
import { WeatherModule } from '../weather/weather.module';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';

@Module({
  imports: [LlmModule, ClosetModule, WeatherModule],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
