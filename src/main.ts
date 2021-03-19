import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accept request from origin "${serverConfig.origin}"`);
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(3000);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
