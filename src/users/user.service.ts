import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersDTO } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginDTO } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UpdateUsersDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUsersDTO: CreateUsersDTO): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUsersDTO.email,
      },
    });
    if (userByEmail) {
      throw new HttpException(
        'Email by taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUsersDTO);
    return await this.userRepository.save(newUser);
  }

  async login(loginDTO: LoginDTO): Promise<UserResponseInterface> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: loginDTO.email,
      },
      select: ['id', 'name', 'email', 'bio', 'image', 'password'],
    });

    if (!userByEmail) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    const passTrue = await compare(loginDTO.password, userByEmail.password);

    if (!passTrue) {
      throw new HttpException('Password is wrong', HttpStatus.NOT_FOUND);
    }
    delete userByEmail.password;

    return this.buildResponse(userByEmail);
  }

  async getUser(loginDTO: LoginDTO): Promise<UserResponseInterface> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: loginDTO.email,
      },
      select: ['id', 'name', 'email', 'bio', 'image', 'password'],
    });

    if (!userByEmail) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    return this.buildResponse(userByEmail);
  }
  async getUserByid(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async updateUser(
    userId: number,
    dateUser: UpdateUsersDTO,
  ): Promise<UserEntity> {
    const user = await this.getUserByid(userId);
    Object.assign(user, dateUser);
    return await this.userRepository.save(user);
  }

  generateToken(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        userName: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  buildResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
