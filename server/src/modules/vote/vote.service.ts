import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vote } from './entities/schemas/vote.schema';

@Injectable()
export class VoteService {
  constructor(@InjectModel(Vote.name) private readonly votingModel: Model<Vote>) {}

  async upvote(businessId: string, userId: string): Promise<Vote> {
    const vote = await this.votingModel.findOneAndUpdate(
      { businessId, userId },
      { $set: { businessId, userId, votedAt: new Date() } },
      { upsert: true, new: true }
    );
    return vote;
  }

  async getVotes(businessId: string): Promise<number> {
    return this.votingModel.countDocuments({ businessId });
  }
}
