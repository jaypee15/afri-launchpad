import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from './entities/schemas/follow.schema';

@Injectable()
export class FollowService {
  constructor(@InjectModel(Follow.name) private readonly followModel: Model<Follow>) {}

  async follow(businessId: string, userId: string): Promise<Follow> {
    const follow = await this.followModel.findOneAndUpdate(
      { businessId, userId },
      { $set: { businessId, userId, followedAt: new Date() } },
      { upsert: true, new: true }
    );
    return follow;
  }

  async unfollow(businessId: string, userId: string): Promise<any> {
    return this.followModel.deleteOne({ businessId, userId });
  }

  async getFollowers(businessId: string): Promise<number> {
    return this.followModel.countDocuments({ businessId });
  }
}
