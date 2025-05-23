/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
    app.enableCors({
    origin: [
    'http://localhost:5173', 
    'https://members-only-app.vercel.app',
  ],
    credentials: true,               
  });

  await app.listen(process.env.PORT ?? 3000);

 
}
bootstrap();
