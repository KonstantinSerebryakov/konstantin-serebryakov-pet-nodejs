import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountLogin,
  AccountRegister,
} from '@konstantin-serebryakov-pet-nodejs/contracts';
import { RMQService } from 'nestjs-rmq';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ApiService } from '../services/api.service';

const CONTROLLER_PREFIX = 'auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly apiService: ApiService
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        AccountRegister.Request,
        AccountRegister.Response
      >(AccountRegister.topic, dto, { headers: { requestId: id } });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    Logger.log("Got Login request with payload:");
    Logger.log(dto);
    try {
      const id = await this.apiService.generateRequestId(CONTROLLER_PREFIX);
      return await this.rmqService.send<
        AccountLogin.Request,
        AccountLogin.Response
      >(AccountLogin.topic, dto, { headers: { requestId: id } });
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }
}
