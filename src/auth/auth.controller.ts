import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthService } from './auth.service';
// import {LoginDto} from './'
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {};

    @Post('login')
    async login(@Body('email') email: string,  @Body('password') password: string)  {
        return this.authService.signIn(email, password);
    }



}
