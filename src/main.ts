import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.overrideLogger(['log','debug','error','warn','verbose']);
  Logger.overrideLogger(true);
  Logger.log('LOGGER LOG WORKING >>>>>>');
  console.log('CONSOLE LOG WORKING >>>>>>');

  app.use((req: Request, res: Response, next) => {
    console.log('===TRIGGER GLOBAL MIDDLEWARE HIS===');
    next();
  });

  app.enableCors({
    origin: process.env.ORIGIN_URL,
    methods: process.env.AVAILABLE_METHODS,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 App running on ${process.env.SOURCE_URL}`);
}
bootstrap();
