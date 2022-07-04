import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CreateUserDTO } from "src/create-user/create-user.dto";
import { createBullBoard } from "bull-board";
import { BullAdapter } from "bull-board/bullAdapter";

@Processor('sendMail-queue')
export class SendMailConsumerService {
    constructor(
        private _mailService: MailerService
    ) { }

    @Process('sendMail-job')
    async sendMailJob(job: Job<CreateUserDTO>) {
        const { data } = job;
        console.log(data);

        await this._mailService.sendMail({
            to: data.email,
            from: "Equipe Code/Drops <codedrops@codedrops.com.br>",
            subject: "Seja bem-vindo(a)!",
            text: `Olá ${data.name}, seu cadastro foi realizado com sucesso. Seja bem-vindo(a)!`,
        });
    }

    @OnQueueCompleted()
    async onCompleted(job: Job<CreateUserDTO>) {
        console.log(`The queue with ${job.data.name} was completed`);
    }
}
