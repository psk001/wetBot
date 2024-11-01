import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
    ) { }

    async createSubscription(userName: string, city: string): Promise<Subscription> {
        const subscription = this.subscriptionRepository.create({ userName, city });
        return this.subscriptionRepository.save(subscription);
    }

    async removeSubscription(userName: string): Promise<void> {
        await this.subscriptionRepository.delete({ userName });
    }

    async getAllSubscriptions(): Promise<Subscription[]> {
        return this.subscriptionRepository.find();
    }
}
