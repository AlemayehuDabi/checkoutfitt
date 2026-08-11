import { BadRequestException, Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('me')
  async getMyWeather(@CurrentUser() user: CurrentUser) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.id },
    });
    if (profile?.latitude == null || profile?.longitude == null) {
      throw new BadRequestException(
        'Set your location in your profile (PATCH /user/profile) first.',
      );
    }
    return this.weatherService.getCurrentWeather(
      profile.latitude,
      profile.longitude,
    );
  }
}
