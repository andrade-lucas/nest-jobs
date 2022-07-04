import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { CreateUserController } from './create-user/create-user.controller';
import { ConfigModule } from '@nestjs/config';
import { SendMailProducerService } from './jobs/sendMail-producer.service';
import { SendMailConsumerService } from './jobs/sendMail-consumer.service';
import { Queue } from 'bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS
      }
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      }
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue'
    })
  ],
  controllers: [CreateUserController],
  providers: [SendMailProducerService, SendMailConsumerService],
})
export class AppModule {
  constructor(
    @InjectQueue('sendMail-queue') private _sendMailQueue: Queue
  ) { }

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this._sendMailQueue)]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
