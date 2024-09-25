import { Module } from '@nestjs/common';
import { ChatModule } from '@Chat/chat.module';
import { RedisService } from '@Shared/redis/redis.service';
import { RabbitmqService } from '@Shared/rabbitmq/rabbitmq.service';
import { AppController } from './app.controller';

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [RedisService, RabbitmqService],
})
export class AppModule {}
