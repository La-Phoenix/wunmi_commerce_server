import { Controller, Post, Body, HttpException, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import { User } from './user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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

    const user = await this.authService.register(name, confirmPassword, email);
    
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
    const user = req.user as User;
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
      const user = await this.authService.validateUser(body.email, body.password);
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

  
}
