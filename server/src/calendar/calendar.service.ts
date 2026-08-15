import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OutfitService } from '../outfit/outfit.service';
import { Prisma } from '../../prisma/generated/prisma';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ListCalendarQueryDto } from './dto/list-calendar-query.dto';
import {
  currentMonth,
  parseDateOnly,
  parseMonthRange,
  todayDateOnly,
} from './date.util';

/** Every response expands the outfit and its items — the calendar UI renders
 * garment thumbnails per day, so returning bare outfit IDs would force the
 * client into an N+1 of follow-up requests. */
const SCHEDULE_INCLUDE = {
  outfit: { include: { items: true } },
} satisfies Prisma.OutfitScheduleInclude;

@Injectable()
export class CalendarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outfitService: OutfitService,
  ) {}

  async create(userId: string, dto: CreateScheduleDto) {
    const date = parseDateOnly(dto.date);
    if (date < todayDateOnly()) {
      throw new BadRequestException(
        'Cannot schedule an outfit for a past date',
      );
    }

    // Throws NotFoundException when the outfit doesn't exist or isn't the
    // caller's — reusing OutfitService keeps ownership logic in one place.
    await this.outfitService.findOne(userId, dto.outfitId);

    try {
      return await this.prisma.outfitSchedule.create({
        data: {
          ownerId: userId,
          outfitId: dto.outfitId,
          date,
          notes: dto.notes,
        },
        include: SCHEDULE_INCLUDE,
      });
    } catch (error) {
      // The [ownerId, date] unique constraint — the day is already taken.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `An outfit is already scheduled for ${dto.date}. Update or delete it first.`,
        );
      }
      throw error;
    }
  }

  async listByMonth(userId: string, query: ListCalendarQueryDto) {
    const month = query.month ?? currentMonth();
    const { start, end } = parseMonthRange(month);

    const entries = await this.prisma.outfitSchedule.findMany({
      where: { ownerId: userId, date: { gte: start, lt: end } },
      include: SCHEDULE_INCLUDE,
      orderBy: { date: 'asc' },
    });

    return { month, entries };
  }

  async findByDate(userId: string, dateString: string) {
    const date = parseDateOnly(dateString);
    const entry = await this.prisma.outfitSchedule.findUnique({
      where: { ownerId_date: { ownerId: userId, date } },
      include: SCHEDULE_INCLUDE,
    });
    if (!entry) {
      throw new NotFoundException(`No outfit scheduled for ${dateString}`);
    }
    return entry;
  }

  async update(userId: string, dateString: string, dto: UpdateScheduleDto) {
    // Doubles as the existence + ownership check.
    await this.findByDate(userId, dateString);

    if (dto.outfitId !== undefined) {
      await this.outfitService.findOne(userId, dto.outfitId);
    }

    return this.prisma.outfitSchedule.update({
      where: {
        ownerId_date: { ownerId: userId, date: parseDateOnly(dateString) },
      },
      data: {
        ...(dto.outfitId !== undefined && { outfitId: dto.outfitId }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: SCHEDULE_INCLUDE,
    });
  }

  async remove(userId: string, dateString: string) {
    await this.findByDate(userId, dateString);
    await this.prisma.outfitSchedule.delete({
      where: {
        ownerId_date: { ownerId: userId, date: parseDateOnly(dateString) },
      },
    });
  }
}
