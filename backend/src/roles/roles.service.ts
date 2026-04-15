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

  async create(data: any) { 
  if (data.permisos) {
    data.permissions = data.permisos.map(pId => ({ id: pId }));
    delete data.permisos;
  }
  
  const role = this.roleRepository.create(data);
  return await this.roleRepository.save(role);
}

  findAll() {
    return this.roleRepository.find({
    relations: ['permissions'] 
  });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

async update(id: number, data: any) {
  // 1. Buscamos el rol existente primero
  const role = await this.roleRepository.findOne({ 
    where: { id },
    relations: ['permissions'] // Cargamos los permisos actuales
  });

  if (!role) throw new Error('Rol no encontrado');

  // 2. Traducimos los permisos de Angular [1, 2] a objetos [{id:1}, {id:2}]
  if (data.permisos) {
    role.permissions = data.permisos.map(pId => ({ id: pId }));
  }

  // 3. Actualizamos el nombre si viene en el data
  if (data.role) {
    role.role = data.role;
  }

  // 4. Usamos .save() porque este sí sabe actualizar tablas relacionales
  return await this.roleRepository.save(role);
}

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
