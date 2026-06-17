import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogService } from './logging/app-log.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  /** 应用 error 日志写入 SQLite AppLog 表（info/warn 等仅控制台） */
  const appLog = app.get(AppLogService);
  app.useLogger(appLog);

  // 开发环境 localhost + 生产环境 CORS_ORIGIN（部署时由 docker-compose 注入）
  const corsOrigins = [
    'http://localhost:3000',
    'http://localhost:4001',
    'http://localhost:4007',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
  ];
  if (process.env.CORS_ORIGIN) {
    corsOrigins.push(process.env.CORS_ORIGIN);
  }

  /** 开发环境允许 localhost/127.0.0.1 任意端口（Vite 端口被占用时会自动递增） */
  const isDev = process.env.NODE_ENV !== 'production';
  const localDevOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

  app.enableCors({
    origin: isDev
      ? (origin, callback) => {
          if (!origin || localDevOriginPattern.test(origin) || corsOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        }
      : corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  /** 部署在 Nginx 后时，从 X-Forwarded-For 解析访客真实 IP */
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Nest API running at http://0.0.0.0:${port}`);
}

bootstrap();
