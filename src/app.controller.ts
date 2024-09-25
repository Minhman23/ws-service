import { Body, Controller, Post } from '@nestjs/common';
import { RabbitmqService } from './shared/rabbitmq/rabbitmq.service';
import { RedisService } from './shared/redis/redis.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly redisService: RedisService,
    private readonly rabbitmq: RabbitmqService,
  ) {}

  @Post('send-message')
  async sendMessage(@Body() payload: { user_ids: string[]; message: string }) {
    await this.rabbitmq.connect();
    await this.rabbitmq.publish('website.exchange', JSON.stringify(payload));
    return { success: true, message: 'Message sent', payload };
  }

  @Post('simulate-online')
  async simulateOnline(
    @Body() payload: { client_id: string; socket_id: string },
  ) {
    await this.redisService.publish(
      'CACHE_FCHAT_CUSTOMER_ONLINE',
      JSON.stringify(payload),
    );
    return { success: true, message: 'Client marked as online', payload };
  }

  @Post('simulate-disconnect')
  async simulateDisconnect(@Body() payload: { client_id: string }) {
    await this.redisService.publish(
      'CACHE_FCHAT_CUSTOMER_DISCONNECTED_TRACKING',
      JSON.stringify(payload),
    );
    return { success: true, message: 'Client marked as disconnected', payload };
  }

  @Post('simulate-facebook-message')
  async simulateFacebookMessage(
    @Body() payload: { client_id: string; message: string },
  ) {
    await this.redisService.publish(
      'REDIS_PUBSUB_FACEBOOK_MSG_TO_WS_CLIENT',
      JSON.stringify(payload),
    );
    return { success: true, message: 'Facebook message simulated', payload };
  }

  @Post('simulate-zalo-message')
  async simulateZaloMessage(
    @Body() payload: { client_id: string; message: string },
  ) {
    await this.redisService.publish(
      'REDIS_PUBSUB_ZALO_MSG_TO_WS_CLIENT',
      JSON.stringify(payload),
    );
    return { success: true, message: 'Zalo message simulated', payload };
  }

  @Post('simulate-fchat-message')
  async simulateFChatMessage(
    @Body() payload: { client_id: string; message: string },
  ) {
    await this.redisService.publish(
      'REDIS_PUBSUB_FCHAT_MSG_TO_WS_CLIENT',
      JSON.stringify(payload),
    );
    return { success: true, message: 'FChat message simulated', payload };
  }

  @Post('simulate-chat-reminder')
  async simulateChatReminder(
    @Body() payload: { client_id: string; reminder: string },
  ) {
    await this.redisService.publish(
      'REDIS_PUBSUB_CHAT_REMINDER',
      JSON.stringify(payload),
    );
    return { success: true, message: 'Chat reminder simulated', payload };
  }
}
