import { Body, Controller, Post } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer.service';
import { CreateUserDTO } from './create-user.dto';

@Controller('create-user')
export class CreateUserController {
    constructor(
        private _mailService: SendMailProducerService
    ) { }

    @Post('/')
    async createUser(@Body() data: CreateUserDTO) {
        this._mailService.sendMail(data);
        return data;
    }
}
