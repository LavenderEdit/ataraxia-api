import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('settings')
export class Setting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 25 })
    focusDuration: number;

    @Column({ default: 5 })
    shortBreakDuration: number;

    @Column({ default: 15 })
    longBreakDuration: number;

    @Column({ default: 'light' })
    theme: string;

    @Column({ default: true })
    soundEnabled: boolean;

    @OneToOne(() => User, (user) => user.settings, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}