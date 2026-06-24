import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getAppConfig } from './config/env.config';
import { AppExceptionFilter } from './common/exceptions/app-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const config = getAppConfig();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SIEM Dashboard API')
    .setDescription(
      'Mini Security Information and Event Management Dashboard API',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();

  await app.listen(config.port);
  logger.log(`Application is running on: http://localhost:${config.port}`);
  logger.log(`Swagger documentation: http://localhost:${config.port}/api`);

  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  for (const signal of signals) {
    process.on(signal, async () => {
      logger.log(`Received ${signal}, starting graceful shutdown...`);
      await app.close();
      logger.log('Graceful shutdown completed');
      process.exit(0);
    });
  }

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection', reason as string);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error.stack);
    process.exit(1);
  });
}
void bootstrap();
