import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.connect();
  }

  async connect() {
    // Kết nối tới Redis
    this.client = createClient({
      url: 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      this.logger.error('Error connecting to Redis:', err);
    });

    await this.client.connect();
    this.logger.log('Connected to Redis');
  }

  async publish(channel: string, message: string) {
    if (!this.client) {
      this.logger.error(
        'Redis client is not initialized. Please call connect() first.',
      );
      throw new Error('Redis client not initialized');
    }

    this.logger.log(`Publishing message to channel ${channel}: ${message}`);
    await this.client.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    if (!this.client) {
      this.logger.error(
        'Redis client is not initialized. Please call connect() first.',
      );
      throw new Error('Redis client not initialized');
    }

    this.client.subscribe(channel, (message) => {
      this.logger.log(`Message received on channel ${channel}: ${message}`);
      callback(message);
    });
  }
}
