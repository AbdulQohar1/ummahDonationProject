import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
// import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService
    ) {}

  async signIn(id: string, pass: string): Promise<any> {
    // Fetch the user with ID
    const user = await this.usersService.findOne(id);

    // Check if user exists and if the password matches
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    // Generating JWT and return it right away
    // Create the payload for the JWT token
    const payload = { sub: user.id, name: user.name };
    
    // Generate the JWT token
    const accessToken =  await this.jwtService.signAsync(payload)
  
    // Return the JWT token
    return {
      access_token: accessToken
    };
  }
}
