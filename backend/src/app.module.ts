import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { TroubleshootModule } from './ai/troubleshoot.module';
import { KnowledgeBaseModule } from './ai/knowledge-base.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomAiModule } from './custom-ai/custom-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ChatModule,
    TroubleshootModule,
    KnowledgeBaseModule,
    DashboardModule,
    CustomAiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}