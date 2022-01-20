import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findOneByName(name: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ name });
    }

    findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ email });
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async create(name: string, email: string, password: string): Promise<User> {
        if(!!(await this.findOneByEmail(email)))
            throw new ConflictException("User with provided email already exist");
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password;
        //let dto = {name, email, password};
        //await this.usersRepository.insert(dto);
        let u = await this.usersRepository.save(user);
        console.log("User: ");
        console.log(u);
        return u;
    }
}