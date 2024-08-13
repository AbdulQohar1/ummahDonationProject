import { 
  Injectable, 
  NotFoundException, 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; 
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

  // get all user
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  
  // create a new user 
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Hash the user's password using bcryptjs
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the new user with the hashed password
    const user = this.usersRepository.create({
      ...createUserDto, 
      password: hashedPassword
    });

    // Save the new user to the database
    return this.usersRepository.save(user);
  };

  // find a user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  return user;
    // try {
    //   const user = await this.usersRepository.findOneBy({ id });
  
    //   if (!user) {
    //     throw new NotFoundException(`User with ID ${id} not found`);
    //   }
  
    //   return user;
    // } catch (error) {
    //   if (error instanceof NotFoundException) {
    //     throw error;
    //   }
    //   console.error('Error finding user:', error);
    //   throw new InternalServerErrorException('An error occurred while trying to find the user');
    // }     

  
    // const user = this.usersRepository.findOneBy({ id });

    // if (!user) {
    //   throw new NotFoundException(`User with ID ${id} not found`);
    // }

    // return user;
  };

  // update user with the id
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Throw exception error if User with the provided id isn't found 
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

     // Update the user with new data
     Object.assign(user, updateUserDto);

     // Save the updated user back to the db
    return this.usersRepository.save(user);
  };
  
  // delete a user by id
  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // await this.usersRepository.delete(id);
    //  `User with the ${id} deleted!`;
  };

  // encrypting user's password
  async signIn(email: string, hashedPassword): Promise <any> {
    const user = await this.usersRepository.findOne( { where: {email} });

    if (user?.password !== hashedPassword) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;
  };

  // find a user with the email for  authentication
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: {email}})
  }


};
