import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get('categories')
  getCategories() {
    return this.planService.getCategories();
  }

  @Get('ai')
  async getAIStory(@Query('query') query: string) {
    return this.planService.getAIStory(query);
  }

  @Get()
  getPlan(@Query('interests') interests?: string) {
    const list = interests ? interests.split(',').map(i => i.trim()) : [];
    return this.planService.getPlan(list);
  }

  @Post()
  addPlace(@Body() place: any) {
    return this.planService.addPlace(place);
  }
}
