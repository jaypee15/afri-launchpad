import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({ timestamps: true })
export class Vote {
  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  votedAt: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
