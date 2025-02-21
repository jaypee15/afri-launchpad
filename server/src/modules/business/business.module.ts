import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { Business, BusinessSchema } from './entities/schemas/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema:BusinessSchema }]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}