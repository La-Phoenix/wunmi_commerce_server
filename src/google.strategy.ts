// src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,  // Replace with actual Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Replace with actual Client Secret
      // callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',  // Replace with your callback URL
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName + name.familyName,
      // picture: photos[0].value,
      accessToken
    };
    const newUser = await this.authService.validateGoogleUser(user);
    done(null, newUser);  // Pass the user object to the request
  }
}
