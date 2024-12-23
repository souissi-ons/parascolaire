import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRep.create(createUserDto);
    const errors = await validate(newUser);

    if (errors.length > 0) {
      const errorMessages = errors.map((err) =>
        Object.values(err.constraints).join(', '),
      );
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Validation échouée : ${errorMessages.join('; ')}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRep.save(createUserDto);
  }

  async findAll() {
    return await this.userRep.find();
  }

  async findOne(id: number) {
    return await this.userRep.findOneBy({ id: id });
  }

  async findEmail(email: string) {
    return await this.userRep.findOneBy({ email: email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return await this.userRep.delete({ id: id });
  }
}
