import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Every user gets a profile row on signup (see the `user.create.after`
    // database hook in src/auth/auth.ts), but upsert keeps this endpoint
    // correct even if that invariant is ever violated (e.g. a user created
    // before the hook existed).
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });
  }
}
