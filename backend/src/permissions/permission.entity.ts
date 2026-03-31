import { Role } from 'src/roles/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, UpdateDateColumn, CreateDateColumn, ManyToMany } from 'typeorm';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    permission: string;

    @Column()
    description: string;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
      
    @Column({ nullable: true })
    created_by: number;
      
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
    
    @Column({ nullable: true })
    updated_by: number;
      
    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
      
    @Column({ nullable: true })
    deleted_by: number;

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[];
}
