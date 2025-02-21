import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':businessupId')
  async follow(@Param('businessId') businessId: string, @Body() body: { userId: string }) {
    return this.followService.follow(businessId, body.userId);
  }

  @Delete(':businessupId')
  async unfollow(@Param('businessId') businessId: string, @Body() body: { userId: string }) {
    return this.followService.unfollow(businessId, body.userId);
  }

  @Get(':businessupId')
  async getFollowers(@Param('businessId') businessId: string) {
    return this.followService.getFollowers(businessId);
  }
}
