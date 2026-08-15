import { Module } from '@nestjs/common';
import { OutfitModule } from '../outfit/outfit.module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [OutfitModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
