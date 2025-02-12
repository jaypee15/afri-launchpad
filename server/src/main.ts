import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { SecretsService } from './global/secrets/service';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/filters';
import { LoggerInterceptor, TransformInterceptor } from './core/interceptors';
import { MainModule } from './app.module';
import { RedisIoAdapter } from './core/adapter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
    cors: true,
  });

  const { PORT, MONGODB_URI } = app.get<SecretsService>(SecretsService);

  app.use(cookieParser());
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ): void => {
      if (req.originalUrl.includes('/webhook')) {
        express.raw({ type: 'application/json' })(req, res, next);
      } else {
        express.json()(req, res, next);
      }
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggerInterceptor(),
    new TransformInterceptor(),
  );

  MongooseModule.forRoot(MONGODB_URI);

  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  await app.listen(PORT);
}
bootstrap();
