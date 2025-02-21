import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BusinessService } from './business.service';
import { Business } from './entities/schemas/business.schema';


@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() businessData: Partial<Business>) {
    return this.businessService.create(businessData);
  }

  @Get()
  findAll() {
    return this.businessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() businessData: Partial<Business>) {
    return this.businessService.update(id, businessData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}