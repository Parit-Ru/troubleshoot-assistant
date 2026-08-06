import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [
    // isGlobal: true means every module in the app can inject ConfigService
    // without each one separately importing ConfigModule — appropriate
    // here since nearly every module we build (auth, database, AI) will
    // need config values.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}