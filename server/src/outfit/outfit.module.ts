import { Module } from '@nestjs/common';
import { LlmModule } from '../ai/llm/llm.module';
import { WeatherModule } from '../weather/weather.module';
import { OutfitController } from './outfit.controller';
import { OutfitService } from './outfit.service';

@Module({
  imports: [LlmModule, WeatherModule],
  controllers: [OutfitController],
  providers: [OutfitService],
  exports: [OutfitService],
})
export class OutfitModule {}
