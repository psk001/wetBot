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

    async createSubscription(chatId: number, city: string): Promise<Subscription> {
        const subscription = this.subscriptionRepository.create({ chatId, city });
        return this.subscriptionRepository.save(subscription);
    }

    async removeSubscription(chatId: number): Promise<void> {
        await this.subscriptionRepository.delete({ chatId });
    }

    async getAllSubscriptions(): Promise<Subscription[]> {
        return this.subscriptionRepository.find();
    }
}
