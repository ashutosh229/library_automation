// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthService } from './services/auth.service';
// import { AuthController } from './controllers/auth.controller';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { UsersModule } from '../users/users.module';
// import { jwtConstants } from './constants';

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: '60m' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
// })
// export class AuthModule {}
