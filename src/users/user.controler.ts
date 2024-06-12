import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUsersDTO } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginDTO } from './dto/login.dto';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { UserEntity } from './user.entity';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUsersDTO } from './dto/updateUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async CreateUser(
    @Body('user') createUsersDTO: CreateUsersDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUsersDTO);
    return this.userService.buildResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async CreateLogin(
    @Body('user') loginDTO: LoginDTO,
  ): Promise<UserResponseInterface> {
    return this.userService.login(loginDTO);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getUser(
    @Req() request: ExpressRequestInterface,
    @User() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Body('user') dateUser: UpdateUsersDTO,
    @Req() request: ExpressRequestInterface,
    @User('id') userId: number,
  ): Promise<UserResponseInterface> {
    const updateUser = await this.userService.updateUser(userId, dateUser);
    return this.userService.buildResponse(updateUser);
  }
}
