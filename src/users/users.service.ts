import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  };
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto); // Use 'usersRepository' here
    return this.usersRepository.save(user); // And here
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id  });
  };

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    // Throw exception error if User with the provided id isn't found 
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

     // Update the user with new data
     Object.assign(user, updateUserDto);

     // Save the updated user back to the db
    return this.usersRepository.save(user);
  };
  
  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.delete(id);
     `User with the ${id} deleted!`;
  }
};
