// user.controller.ts
import { Controller, Get, Param, UseGuards, Req, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
