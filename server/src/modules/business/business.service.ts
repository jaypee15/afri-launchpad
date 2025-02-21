import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from './entities/schemas/business.schema';

@Injectable()
export class BusinessService {
  constructor(@InjectModel(Business.name) private businessModel: Model<BusinessDocument>) {}

  async create(businessData: Partial<Business>): Promise<Business> {
    const business = new this.businessModel(businessData);
    return business.save();
  }

  async findAll(): Promise<Business[]> {
    return this.businessModel.find().exec();
  }

  async findOne(id: string): Promise<Business> {
    return this.businessModel.findById(id).exec();
  }

  async update(id: string, businessData: Partial<Business>): Promise<Business> {
    return this.businessModel.findByIdAndUpdate(id, businessData, { new: true }).exec();
  }

  async remove(id: string): Promise<Business> {
    return this.businessModel.findByIdAndDelete(id).exec();
  }
}