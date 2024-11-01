import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../entities/subscription.entity';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post()
    async subscribe(
        @Body('chatId') chatId: number,
        @Body('name') name: string,
        @Body('city') city: string
    ): Promise<Subscription> {
        return this.subscriptionService.createSubscription(chatId, name, city);
    }

    @Delete()
    async unsubscribe(
        @Body('chatId') chatId: number,
        @Body('city') city: string
    ): Promise<void> {
        return this.subscriptionService.removeSubscription(chatId, city);
    }

    @Get()
    async getAllSubscriptions(): Promise<Subscription[]> {
        return this.subscriptionService.getAllSubscriptions();
    }
}
