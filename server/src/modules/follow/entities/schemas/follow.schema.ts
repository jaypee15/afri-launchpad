import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  followedAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
