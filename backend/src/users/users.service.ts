import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: any) {

  //if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  //}
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }


  findAll() {
    return this.userRepository.find({
    withDeleted: true,
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<User>) {
    if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.update(id, { active: false });
    return this.userRepository.softDelete(id);
  }

  async findOneByLogin(loginTerm: string) {
  return this.userRepository.findOne({ where: [
      { email: loginTerm, active: true },
      { username: loginTerm, active: true }
  ]});
}
}