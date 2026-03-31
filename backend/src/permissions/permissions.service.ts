import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

create(data: Partial<Permission>) {
    const permission = this.permissionRepository.create(data);
    return this.permissionRepository.save(permission);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Permission>) {
    await this.permissionRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.permissionRepository.delete(id);
  }
}
