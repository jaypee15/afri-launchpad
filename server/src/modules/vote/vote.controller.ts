import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VoteService } from './vote.service';

@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post(':businessId/upvote')
  async upvote(@Param('businesspId') businessId: string, @Body() body: { userId: string }) {
    return this.voteService.upvote(businessId, body.userId);
  }

  @Get(':businessId')
  async getVotes(@Param('businessId') businessId: string) {
    return this.voteService.getVotes(businessId);
  }
}
