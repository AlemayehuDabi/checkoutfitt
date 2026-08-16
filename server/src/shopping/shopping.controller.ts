import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ShoppingService } from './shopping.service';
import { EvaluateProductDto } from './dto/evaluate-product.dto';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  // 200: a one-shot evaluation, nothing is persisted.
  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  evaluate(@CurrentUser() user: CurrentUser, @Body() dto: EvaluateProductDto) {
    return this.shoppingService.evaluate(user.id, dto);
  }
}
