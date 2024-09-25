# WebSocket Microservice Documentation

## Tổng Quan
Microservice này được thiết kế để xử lý các kết nối WebSocket và đăng ký nhận thông điệp từ cả **Redis** và **RabbitMQ**. Nó lắng nghe các cập nhật theo thời gian thực như trạng thái kết nối của khách hàng và nhân viên bán hàng, các thông điệp đến từ Facebook, Zalo và FChat, cũng như các nhắc nhở, và chuyển tiếp chúng đến các khách hàng kết nối WebSocket.

### Các Tính Năng Chính:
- Xử lý các kết nối WebSocket cho giao tiếp theo thời gian thực.
- Đăng ký các kênh Redis để nhận các cập nhật trạng thái và thông điệp.
- Đăng ký RabbitMQ để xử lý thông điệp bổ sung.
- Hỗ trợ nhiều dịch vụ chat bên ngoài như Facebook, Zalo và FChat.

---

## Cấu Trúc Dự Án Cần Biết
```
├── src 
│   ├── app.controller.ts        # Controller giả lập  các sự kiện pub/sub 
│   ├── app.module.ts            # Module chính của ứng dụng
│   ├── chat                     # Thư mục chứa mode iên quan đến chat
│   │   ├── chat.gateway.ts      # Module quản lý chat
│   │   └── chat.module.ts       # Module quản lý chat
│   ├── main.ts                  # Entry point của ứng dụng
│   └── shared                   # Thư mục chứa các service chung
│       ├── rabbitmq             # Service quản lý RabbitMQ
│       └── redis                # Service quản lý Redis
├── test                         # Thư mục chứa các file test
├── nest-cli.json
├── package-lock.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

### `app.controller.ts`
- Cung cấp các điểm cuối HTTP để giả lập hoạt động của khách hàng và gửi thông điệp.
- Phát các sự kiện như trạng thái online, ngắt kết nối và thông điệp đến Redis và RabbitMQ.

### `chat.gateway.ts`
- WebSocket Gateway để xử lý giao tiếp theo thời gian thực.
- Đăng ký các kênh Redis để nhận và phát các cập nhật đến các khách hàng WebSocket kết nối.

### `rabbitmq.service.ts`
- Xử lý kết nối RabbitMQ và phát thông điệp.
- Được sử dụng để phát thông điệp đến các exchange RabbitMQ.

### `redis.service.ts`
- Quản lý chức năng pub/sub của Redis.
- Đăng ký các kênh để nhận các cập nhật trạng thái theo thời gian thực và phát chúng đến các khách hàng WebSocket.

---

## Các Sự Kiện WebSocket

### Các Sự Kiện Gửi Đến Khách Hàng
- **`welcome`**: Gửi khi một khách hàng kết nối với WebSocket.
- **`goodbye`**: Gửi khi một khách hàng ngắt kết nối.
- **`status_update`**: Gửi khi trạng thái online của khách hàng hoặc nhân viên bán hàng được cập nhật.
- **`client_disconnected`**: Gửi khi một khách hàng ngắt kết nối.
- **`facebook_message`**: Gửi khi nhận được một thông điệp từ Facebook.
- **`zalo_message`**: Gửi khi nhận được một thông điệp từ Zalo.
- **`fchat_message`**: Gửi khi nhận được một thông điệp từ FChat.
- **`chat_reminder`**: Gửi khi một nhắc nhở chat được kích hoạt.

---

## API Endpoints Simulate 

### 1. **POST /api/send-message**
Gửi một thông điệp đến RabbitMQ để xử lý.

**Payload:**
```json
{
  "user_ids": ["string"],
  "message": "string"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/send-message \
-H "Content-Type: application/json" \
-d '{
  "user_ids": ["user1", "user2"],
  "message": "hélu từ RabbitMQ!"
}'
```

### 2. POST /api/simulate-online
Giả lập một khách hàng trực tuyến. Phát sự kiện đến Redis.

**Payload:**
```json
{
  "client_id": "string",
  "socket_id": "string"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/simulate-online \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client1",
  "socket_id": "socket123"
}'
```

### 3. POST /api/simulate-disconnect
Giả lập một khách hàng ngắt kết nối. Phát sự kiện đến Redis.

**Payload:**
```json
{
  "client_id": "client1"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/simulate-disconnect \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client1"
}'
```


### 4. POST /api/simulate-facebook-message
Giả lập việc nhận một thông điệp từ Facebook và phát nó đến các khách hàng WebSocket thông qua Redis.

**Payload:**
```json
{
  "client_id": "string",
  "message": "string"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/simulate-facebook-message \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client1",
  "message": "hélu từ Facebook!"
}'
```

### 5. POST /api/simulate-zalo-message
Giả lập việc nhận một thông điệp từ Zalo và phát nó đến các khách hàng WebSocket thông qua Redis.

**Payload:**
```json
{
  "client_id": "string",
  "message": "string"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/simulate-zalo-message \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client1",
  "message": "hélu từ Zalo!"
}'
```

### 6. POST /api/simulate-fchat-message
Giả lập việc nhận một thông điệp từ FChat và phát nó đến các khách hàng WebSocket thông qua Redis.

**Payload:**
```json
{
  "client_id": "string",
  "message": "string"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/simulate-fchat-message \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client1",
  "message": "hélu từ FChat!"
}'
```

### POST /api/simulate-chat-reminder
Giả lập một nhắc nhở chat và phát nó đến các khách hàng WebSocket thông qua Redis.

**Payload:**
```json
{
  "client_id": "string",
  "reminder": "string"
}
```
Ví dụ: 
```
curl -X POST http://localhost:3000/api/simulate-chat-reminder \
-H "Content-Type: application/json" \
-d '{
  "client_id": "client1",
  "reminder": "Đừng bỏ rơi em!"
}'
```

</br>
***

### Cách Thức Hoạt Động Của Hệ Thống
#### 1. WebSocket Gateway:
 Khi một khách hàng kết nối qua WebSocket, ChatGateway xử lý kết nối và gửi thông điệp chào mừng.
- Khi một khách hàng ngắt kết nối, nó gửi thông điệp tạm biệt.
- Các sự kiện WebSocket như message được xử lý và sau đó được phát đến Redis để các dịch vụ khác tiêu thụ.

#### 2. Đăng Ký Redis:
- ChatGateway đăng ký nhiều kênh Redis để nhận các cập nhật theo thời gian thực như trạng thái online, ngắt kết nối và thông điệp từ các dịch vụ bên ngoài như Facebook, Zalo và FChat.
- Khi nhận được một thông điệp từ Redis, gateway phát thông điệp đến tất cả các khách hàng WebSocket đang kết nối.

#### 3. Tích Hợp RabbitMQ:
- Mặc dù microservice chủ yếu đăng ký các kênh Redis, RabbitMQ được sử dụng cho việc phân phối sự kiện nội bộ (ví dụ: sự kiện ngắt kết nối khách hàng).
- RabbitmqService xử lý việc phát thông điệp đến các exchange RabbitMQ khi được kích hoạt bởi các sự kiện nhất định như ngắt kết nối của khách hàng.
