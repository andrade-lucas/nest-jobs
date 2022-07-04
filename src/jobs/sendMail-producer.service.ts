import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { CreateUserDTO } from "src/create-user/create-user.dto";

@Injectable()
export class SendMailProducerService {
    constructor(
        @InjectQueue('sendMail-queue') private _queue: Queue
    ) { }

    async sendMail(data: CreateUserDTO) {
        await this._queue.add('sendMail-job', data);
    }
}
