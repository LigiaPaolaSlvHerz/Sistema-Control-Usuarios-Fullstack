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

    if (!data.email || !data.username || !data.password) {
    throw new Error('Todos los campos son obligatorios');
  }

    const existingUser = await this.userRepository.findOne({
    where: [
      { email: data.email },
      { username: data.username }
    ]
  });

  
  if (existingUser) {
    throw new Error('Email o Username ya están registrados');
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = this.userRepository.create({
    ...data,
    password: hashedPassword
  });
  const savedUser = await this.userRepository.save(newUser);

  if (!data.created_by) {
      (savedUser as any).created_by = (savedUser as any).id;
    } else {
      (savedUser as any).created_by = data.created_by;
    }
  return await this.userRepository.save(savedUser);
  }


  findAll() {
    return this.userRepository.find({
    withDeleted: true,
     relations: ['role'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<User>) {
  // 1. Verificamos si la contraseña existe y no viene vacía
  if (data.password && data.password.trim() !== '') {
    // Si tiene contenido real, la hasheamos para guardarla segura
    data.password = await bcrypt.hash(data.password, 10);
  } else {
    // 2. ¡ESTA ES LA CLAVE! 
    // Si viene vacía, usamos 'delete' para quitar la propiedad del objeto.
    // Al no estar en el objeto 'data', TypeORM no la toca en la base de datos.
    delete data.password;
  }

  // 3. Se actualiza solo lo que quedó en el objeto (nombre, email, etc.)
  await this.userRepository.update(id, data);
  
  // 4. Retornamos el usuario ya actualizado para confirmación
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
  ],
  //Sacar el rol de los usuarios
  relations: {
      role: {
        permissions: true 
      }
    }

});
}
}