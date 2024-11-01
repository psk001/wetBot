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

    async createSubscription(chatId: number, name: string, city: string): Promise<Subscription> {
        let subscription = await this.subscriptionRepository.findOne({ where: { chatId, name, city } });

        if (subscription) {
            // Update existing subscription
            subscription.name = name;
        } else {
            // Create new subscription
            subscription = this.subscriptionRepository.create({ chatId, name, city, status: 'active' });
        }

        return this.subscriptionRepository.save(subscription);
    }

    async removeSubscription(
        chatId: number,
        city: string
    ): Promise<void> {
        await this.subscriptionRepository.delete({ chatId, city });
    }

    async updateSubcription(
        chatId: number,
        status: string
    ): Promise<void> {
        await this.subscriptionRepository.update(
            {
                chatId
            },
            {
                chatId,
                status
            }
        )
    }

    async getAllSubscriptions(): Promise<Subscription[]> {
        return this.subscriptionRepository.find();
    }
}
