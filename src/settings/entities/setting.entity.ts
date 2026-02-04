import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('settings')
@Index(['user', 'platform'], { unique: true })
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

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

    // ✨ NUEVO: Para soporte multiplataforma
    @Column({ default: 'web' })
    platform: string; // 'web', 'mobile', 'desktop'

    // CAMBIO: De OneToOne a ManyToOne
    // Un usuario tiene muchas configuraciones (una por plataforma)
    @ManyToOne(() => User, (user) => user.settings, { onDelete: 'CASCADE' })
    user: User;
}