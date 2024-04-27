import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  // AccessToken도 RefreshTokenGuard가 적용되어야함.
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    // Bearer token 중 token만 받아옴

    // token을 rotateToken에 넣어서 새로운 accessToken을 넣음. 이걸 응답으로 반환해줌.
    const newToken = this.authService.rotateToken(token, false);
    /**
     * {accessToken: {token}}
     */
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    // Bearer token 중 token만 받아옴

    // token을 rotateToken에 넣어서 새로운 accessToken을 넣음. 이걸 응답으로 반환해줌.
    // refreshToken은 true임
    const newToken = this.authService.rotateToken(token, true);
    /**
     * {accessToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  // POST auth/login/email
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  // authorization 기준으로 rawToken을 받아옴.
  postLoginEmail(@Headers('authorization') rawToken: string) {
    // email:password -> base64
    // adsfasdfasfdad => email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail({
      email: credentials.email,
      password: credentials.password,
    });
  }

  // POST auth/register/email
  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }
}