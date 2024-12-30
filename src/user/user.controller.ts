// user.controller.ts
import { Controller, Get, Param, UseGuards, Req, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() { 
    try {
      const users = await this.userService.find();
      return users;
    } catch (error) { 
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('with-products')
  async getUsersWithProducts() { 
    return this.userService.findUsersWithProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    try {
      const users = await this.userService.findUserById(userId);
      return users;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/products')
  async getUserWithProducts(@Param('id') userId: string) {
    try {
      const user = await this.userService.findUserWithProducts(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }
}
