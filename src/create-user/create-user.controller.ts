import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';

@Controller('create-user')
export class CreateUserController {
    @Post('/')
    createUser(@Body() data: CreateUserDTO) {
        return data;
    }
}
