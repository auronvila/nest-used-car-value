import {
  Body,
  Controller,
  Delete,
  Get, HttpException, HttpStatus,
  Param,
  Patch,
  Post, Session, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user-decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {
  }

  // COOKIE EXAMPLE
  // @Get('/colors/:color')
  // async setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }
  //
  // @Get('/colors')
  // async getColor(@Session() session: any) {
  //   return session.color;
  // }

  @Post('/sign-up')
  async createUser(@Body() newUserData: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(newUserData.email, newUserData.password);
    session.userId = user.id;
    return user;
  }

  @Post('/sign-in')
  async signIn(@Body() userCredentials: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(userCredentials.email, userCredentials.password);
    session.userId = user.id;
    return user;
  }

  @Post('/sign-out')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  // @Get('whoami')
  // async whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @Get('whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: UserEntity) {
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') currentUserId: string) {
    return this.userService.findOne(currentUserId);
  }

  @Get()
  async getAllUsers() {
    return this.userService.find();
  }

  @Delete('/:id')
  async deleteUser(@Param('id') currentUserId: string) {
    return this.userService.remove(currentUserId);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.userService.update(id, updateData);
  }
}
