import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5000', // Replace with your frontend URL during development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.enableCors(corsOptions);

  await app.listen(3000);
  // console.log(`Application is running on: ${await app.getUrl()}`);
  // console.log(app.getHttpServer()._events.request._router.stack);
}
bootstrap();
