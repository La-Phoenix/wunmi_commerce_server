import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return false;
    }

    try {
      console.log(token)
      // Verify the token
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = user; // Attach user info to request
      console.log(user)
      return true;
    } catch (e) {
      
      return false;
    }
  }
}