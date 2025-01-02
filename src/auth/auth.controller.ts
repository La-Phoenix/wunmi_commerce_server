import { Controller, Post, Body, HttpException, HttpStatus, Get, UseGuards, Req, Res, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import { User } from '../Schemas/user.schema';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  @Post('register')
  async register(@Body() body: { name: string; confirmPassword: string, email: string }, @Res() res: Response) {
    const { name, confirmPassword, email } = body;
    // Check if all required fields are present
    if (!name || !confirmPassword || !email) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'name, confirmPassword, and email fields are required',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the user already exists
    const userExists = await this.authService.findUserByEmail(email);
    if (userExists) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'User with this email already exists',
          error: 'Conflict',
        },
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.authService.register(name, confirmPassword, email)  as User & {_id: string};
    const token = await this.authService.generateToken(user);

    res.cookie('token', token, {
        httpOnly: true,          // Makes the cookie inaccessible to JavaScript
        secure: false,            // Set to true in production (HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // Set expiry time (e.g., 1 day)
      });
    return res.json({...user });
  }

  
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    // Redirects to Google
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User & {_id: string};
    const token = await this.authService.generateToken(user);
    // Redirect back to the frontend with the token in the URL
    res.cookie('token', token, {
      httpOnly: false,          // Makes the cookie inaccessible to JavaScript
      secure: false,            // Set to true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // Set expiry time (e.g., 1 day)
    });
    res.redirect(`http://localhost:5173`);
  }


  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(body.email, body.password) as User & {_id: string};
      const token = await this.authService.generateToken(user);

      res.cookie('token', token, {
        httpOnly: false,          // Makes the cookie inaccessible to JavaScript
        secure: false,            // Set to true in production (HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // Set expiry time (e.g., 1 day)
      });

      return res.json({
        message: 'Login successful',
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Res() res: Response) {
    try {    
      const user = await this.userService.findByEmail(email) as User & {_id: string};
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const token = await this.authService.generateToken(user);
      
      await this.mailService.sendResetPasswordEmail(user.email, token);
      res.json({ message: 'Reset password link sent to your email' })
    } catch (error) {
      // Handle known errors
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      // Catch unexpected errors
      throw new InternalServerErrorException(
        'An error occurred while resetting the password',
      );
    }
  }

@Post('reset-password')
async resetPassword(
  @Body('token') token: string,
  @Body('newPassword') newPassword: string,
) {
  try {
    const jwtuser = this.jwtService.verify(token, {
      secret: this.configService.get<string>('app.jwtSecret'),
    });

    if (!jwtuser.email) {
      throw new BadRequestException('Invalid or expired token');
    }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await this.userService.update(jwtuser.email, hashedPassword);
      if (result.modifiedCount === 0) {
        throw new Error('Password update failed. User may not exist.');
      }

      return { message: 'Password reset successfully' };
    } catch (error) {
      // Handle known errors
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
    }

    // Catch unexpected errors
      throw new InternalServerErrorException(
        'An error occurred while resetting the password',
      );
    
    }
  }

}
