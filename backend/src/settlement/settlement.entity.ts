import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Municipality } from '../municipalities/municipality.entity';

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  settlement!: string;

  @Column()
  municipality_id!: number;

  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: true })
  created_by!: number;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ type:'decimal', nullable: true})
  latitude!: number;

  @Column({ type:'decimal', nullable: true})
  longitude!: number;

  

  // Relación: Muchos asentamientos pertenecen a un municipio
  @ManyToOne(() => Municipality, (municipality) => municipality.settlements)
  @JoinColumn({ name: 'municipality_id' }) // Le decimos que esta es la llave
  municipality!: Municipality;
}