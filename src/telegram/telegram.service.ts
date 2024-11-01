import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from '@/subscription/subscription.service';

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);
    private subscribers: Map<number, string> = new Map(); // chatId -> city

    constructor(
        @InjectBot() private bot: Telegraf,
        private configService: ConfigService,
        private subscriptionService: SubscriptionService,
    ) { }

    async subscribe(chatId: number, name: string, city: string): Promise<string> {
        // this.subscribers.set(chatId, city);
        await this.subscriptionService.createSubscription(chatId, name, city);
        const weather = await this.getWeather(city);
        return `Successfully subscribed to daily weather updates for ${city}. ${weather}`;
    }

    async unsubscribe(chatId: number, city: string): Promise<string> {
        // this.subscribers.delete(chatId, city);
        return 'Successfully unsubscribed from daily weather updates';
    }

    async weatherNow(chatId: number): Promise<string> {
        const city = this.subscribers.get(chatId);
        // get from db
        if (!city) {
            return 'You are not subscribed to daily weather updates';
        }
        const weather = await this.getWeather(city);
        return `Current weather for ${city}: ${weather}`;
    }
    // Explicitly define type for the method
    @Cron(CronExpression.EVERY_DAY_AT_8AM, { timeZone: 'UTC' } as any)
    public async sendDailyUpdates(): Promise<void> {
        this.logger.log('Starting daily weather updates...');
        try {
            for (const [chatId, city] of this.subscribers.entries()) {
                const weather = await this.getWeather(city);
                this.logger.log(weather);
                await this.bot.telegram.sendMessage(chatId, weather);
                this.logger.debug(`Sent weather update for ${city} to chat ${chatId}`);
            }
        } catch (error) {
            this.logger.error('Error sending daily updates:', error);
        }
    }

    private async getWeather(city: string): Promise<string> {
        try {
            const apiKey = this.configService.get<string>('WEATHER_API_KEY');
            if (!apiKey) {
                throw new Error('Weather API key not configured');
            }
            // Implement weather API call here
            // For example, using OpenWeatherMap API
            //   return `Weather forecast for ${city}: Sunny, 25°C`; // Placeholder
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?q=${city}&lang=english&key=${apiKey}`
            );

            const data = await response.json();

            this.logger.log(data)
            return `Current temperature is ${data.current.temp_c} C.\nWind is ${data.current.wind_kph} kmph`

        } catch (error) {
            this.logger.error(`Error fetching weather for ${city}:`, error);
            throw error;
        }
    }
}
