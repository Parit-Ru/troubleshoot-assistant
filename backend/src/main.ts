import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
  origin: [
    "https://parit-ru.github.io",       // https://parit-ru.github.io
    "http://localhost:5173",        // your local Vite dev server
  ],
  credentials: true,
});

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
