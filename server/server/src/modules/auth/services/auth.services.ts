// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../../users/services/users.service';
// import { User } from '../../users/entities/users.schema';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<User | null> {
//     const user = await this.usersService.findOne(email);
//     if (user && user.password === password) {
//       // use bcrypt to compare hashed passwords in real applications
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }

//   async login(user: any) {
//     const payload = { email: user.email, sub: user.userId };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
// }
