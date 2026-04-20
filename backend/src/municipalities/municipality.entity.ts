import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Settlement } from '../settlement/settlement.entity';

@Entity('municipalities') // El nombre exacto que le pusiste en Navicat
export class Municipality {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ nullable: true })
  created_by!: number;

  @Column()
  municipality!: string;
  
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ nullable: true })
  updated_by!: number;

  // Relación: Un municipio tiene muchos asentamientos
  @OneToMany(() => Settlement, (settlement) => settlement.municipality)
  settlements!: Settlement[];
}