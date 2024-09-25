import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisService } from '@Shared/redis/redis.service';
import { RabbitmqService } from '@Shared/rabbitmq/rabbitmq.service';

@Module({
  providers: [ChatGateway, RedisService, RabbitmqService],
})
export class ChatModule {}
