import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

create(data: Partial<Role>) {
    const role = this.roleRepository.create(data);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

async update(id: number, data: any) {
  if (data.permissions) {
    data.permissions = data.permissions.map(pId => ({ id: pId }));
  }
  return await this.roleRepository.save({ id, ...data });
}

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
