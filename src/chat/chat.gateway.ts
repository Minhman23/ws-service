import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisService } from '@Shared/redis/redis.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly redisService: RedisService) {
    // Khi khởi tạo, chúng ta đăng ký nhận thông điệp từ các kênh Redis.
    this.subscribeToRedisChannels();
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('welcome', { success: true });
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('goodbye', { success: true });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: { user_ids: string[]; message: string },
  ) {
    console.log(
      `Received message: ${payload.message} from users: ${payload.user_ids}`,
    );
    await this.redisService.publish(
      'website.exchange',
      JSON.stringify(payload),
    );
    this.server.emit('customer_message', payload);
  }

  async subscribeToRedisChannels() {
    const channels = [
      {
        name: 'CACHE_FCHAT_CUSTOMER_ONLINE',
        event: 'status_update',
        key: 'client_id',
        status: 'online',
      },
      {
        name: 'CACHE_FCHAT_SALEMAN_ONLINE',
        event: 'event_user_id',
        key: 'saleman_id',
      },
      {
        name: 'CACHE_FCHAT_CUSTOMER_DISCONNECTED_TRACKING',
        event: 'client_disconnected',
        key: 'client_id',
      },
      {
        name: 'REDIS_PUBSUB_FACEBOOK_MSG_TO_WS_CLIENT',
        event: 'facebook_message',
        key: 'message',
      },
      {
        name: 'REDIS_PUBSUB_ZALO_MSG_TO_WS_CLIENT',
        event: 'zalo_message',
        key: 'message',
      },
      {
        name: 'REDIS_PUBSUB_FCHAT_MSG_TO_WS_CLIENT',
        event: 'fchat_message',
        key: 'message',
      },
      {
        name: 'REDIS_PUBSUB_CHAT_REMINDER',
        event: 'chat_reminder',
        key: 'reminder',
      },
    ];

    for (const channel of channels) {
      await this.redisService.subscribe(channel.name, (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(
          `Received ${channel.name} message: ${parsedMessage[channel.key]}`,
        );
        this.server.emit(channel.event, parsedMessage);
      });
    }
  }
}
