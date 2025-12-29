import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Timer } from '../../timers/entities/timer.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ unique: true, nullable: true })
    deviceId: string;

    @Column({ default: false })
    isGuest: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    lastLogin: Date;

    @OneToMany(() => Timer, (timer) => timer.user)
    timers: Timer[];
}