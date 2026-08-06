import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Allows the frontend dev server (Vite, port 5173) to call this API.
  // Reads FRONTEND_URL from .env (added back in Phase 4.2) rather than
  // hardcoding the URL, so this stays correct if the frontend's port
  // or deployed URL ever changes.
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL"),
  });

  const port = configService.get<number>("PORT") ?? 3000;
  await app.listen(port);
}
bootstrap();