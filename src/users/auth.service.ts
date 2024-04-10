import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {
  }

  async signUp(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new HttpException('user with this email already exists', HttpStatus.BAD_REQUEST);
    }
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //Join the hashed result and the salt
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    return await this.userService.createUser(email, result);
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('a user with this email does not exists', HttpStatus.NOT_FOUND);
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
