import { Update, Start, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { Logger } from '@nestjs/common';

@Update()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramService.name);
  constructor(private readonly telegramService: TelegramService) { }

  @Start()
  async start(@Ctx() ctx: Context) {
    // @ts-expect-error Property 'chat' does not exist on type 'Message'.
    const name = ctx.chat.first_name;
    const welcomeMessage = `
    <b>Hi ${name}!</b> Welcome to Weather Bot!
    Use the following commands to interact with the bot:
    
    <b>/subscribe &lt;city&gt; </b>  - Get daily weather updates
    <b>/unsubscribe &lt;city&gt;</b> - Stop receiving updates
    <b>/weatherNow &lt;city&gt; </b> - Get the current weather
  `;
    await ctx.reply(
      welcomeMessage,
      {
        parse_mode: 'HTML',
      }
    );
  }

  @Command('subscribe')
  async subscribe(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const city = message.text.split(' ')[1];
    //@ts-expect-error Property 'first_name' does not exist on type 'undefined'.
    const name = ctx.chat.first_name;

    if (!city) {
      return ctx.reply('Please provide a city name. Example: /subscribe London');
    }

    // @ts-expect-error Property 'chat' does not exist on type 'Message'.
    const response = await this.telegramService.subscribe(ctx.chat.id, name, city);
    return ctx.reply(response);
  }

  @Command('unsubscribe')
  async unsubscribe(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const city = message.text.split(' ')[1];

    if (!city) {
      return ctx.reply('Please provide a city name. Example: /subscribe London');
    }

    // @ts-expect-error Property 'chat' does not exist on type 'Message'.
    const response = await this.telegramService.unsubscribe(ctx.chat.id, city);
    return ctx.reply(response);
  }

  @Command('weatherNow')
  async weatherNow(@Ctx() ctx: Context) {
    this.logger.log(`context message: ${ctx.message}`);
    // @ts-expect-error Property 'chat' does not exist on type 'Message'.
    const response = await this.telegramService.weatherNow(ctx.chat.id);
    this.logger.log(response);
    return ctx.reply(response);
  }
}