import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from './telegram/telegram.module';
import { SubscriptionService } from './subscription/subscription.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Subscription],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Subscription]),
    TelegramModule,
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class AppModule {}