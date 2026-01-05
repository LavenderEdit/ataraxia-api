import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Setting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 25 })
    focusDuration: number;

    @Column({ default: 5 })
    shortBreakDuration: number;

    @Column({ default: 15 })
    longBreakDuration: number;

    @Column({ default: false })
    autoStartBreaks: boolean;

    @Column({ default: false })
    autoStartPomodoros: boolean;

    @Column({ default: 4 })
    longBreakInterval: number;

    @Column({ default: 'light' })
    theme: string;

    @Column({ default: true })
    soundEnabled: boolean;

    @OneToOne(() => User, (user) => user.setting, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}