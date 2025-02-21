import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalModule } from './global/global.module';
import { SecretsModule } from './global/secrets/module';
import { SecretsService } from './global/secrets/service';
import { BusinessModule } from './modules/business/business.module';
import { CommentsModule } from './modules/comment/comment.module';
import { VoteModule } from './modules/vote/vote.module';
import { FollowModule } from './modules/follow/follow.module';

@Module({
  imports: [
    GlobalModule,
    MongooseModule.forRootAsync({
      imports: [SecretsModule],
      inject: [SecretsService],
      useFactory: (secretsService: SecretsService) => ({
        uri: secretsService.MONGODB_URI,
      }),
    }),
    BusinessModule,
    CommentsModule,
    VoteModule,
    FollowModule,
    // AuthModule,

  ],
  providers: [],
  controllers: [],
})
export class MainModule {}
