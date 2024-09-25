import { Injectable } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitmqService {
  private channel: Channel;
  private connection: Connection;

  async connect() {
    // Kết nối tới RabbitMQ
    if (!this.connection) {
      this.connection = await connect('amqp://localhost:5672');
    }

    // Tạo channel nếu chưa có
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }
  }

  async publish(exchange: string, message: string) {
    // Đảm bảo kênh đã được khởi tạo trước khi publish
    if (!this.channel) {
      throw new Error(
        'RabbitMQ channel is not initialized. Call connect() first.',
      );
    }

    // Xác nhận exchange và publish thông điệp
    await this.channel.assertExchange(exchange, 'fanout');
    this.channel.publish(exchange, '', Buffer.from(message));
  }

  // Đóng kết nối khi cần
  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
