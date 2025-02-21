import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteSchema , Vote} from './entities/schemas/vote.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
