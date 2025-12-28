import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ name: 'device_id', unique: true, nullable: true })
    deviceId: string;

    @Column({ name: 'is_guest', default: true })
    isGuest: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}