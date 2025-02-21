import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessDocument = Business & Document;

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  tagline: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  logo: string;

  @Prop()
  coverImage: string;

  @Prop({ required: true })
  website: string;

  @Prop({ required: true })
  sector: string;

  @Prop({ required: true })
  stage: string;

  @Prop()
  foundedDate: Date;

  @Prop({ required: true })
  launchDate: Date;

  @Prop({ type: [String], default: [] })
  founders: string[];

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  followers: number;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ type: Object })
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };

  @Prop({ enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' })
  status: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop()
  featuredDate: Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);