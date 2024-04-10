import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
  }

  async createUser(email: string, password: string) {
    const newUser = this.userRepository.create({ email, password });
    return await this.userRepository.save(newUser);
  }

  async findOne(id: string) {
    if (!id) {
      throw new HttpException('Id was not provided',HttpStatus.BAD_REQUEST)
    }
    return this.userRepository.findOneBy({ id });
  }

  async find() {
    return this.userRepository.find();
  }

  async update(id: string, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.BAD_REQUEST);
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.BAD_REQUEST);
    }

    return this.userRepository.remove(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
