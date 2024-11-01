import { Update, Start, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      'Welcome to Weather Bot!\n' +
      'Use /subscribe <city> to get daily weather updates\n' +
      'Use /unsubscribe to stop receiving updates'
    );
  }

  @Command('subscribe')
  async subscribe(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const city = message.text.split(' ')[1];
    
    if (!city) {
      return ctx.reply('Please provide a city name. Example: /subscribe London');
    }

    // @ts-expect-error Property 'chat' does not exist on type 'Message'.
    const response = await this.telegramService.subscribe(ctx.chat.id, city);
    return ctx.reply(response);
  }

  @Command('unsubscribe')
  async unsubscribe(@Ctx() ctx: Context) {
    // @ts-expect-error Property 'chat' does not exist on type 'Message'.
    const response = await this.telegramService.unsubscribe(ctx.chat.id);
    return ctx.reply(response);
  }
}