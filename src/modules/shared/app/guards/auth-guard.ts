import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '../../utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader: string = request?.headers?.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const decodedToken = await this.jwtService.verify(token);
      request.userId = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
