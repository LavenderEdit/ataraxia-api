import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Timer } from '../../timers/entities/timer.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { UserAchievement } from '../../gamification/entities/user-achievement.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ select: false, nullable: true })
    password: string;

    @Column({ nullable: true }) // Será obligatorio por lógica de negocio (DTO), pero nullable en BD para invitados
    username: string; // El nombre de usuario o apodo principal

    @Column({ nullable: true })
    name: string; // Nombre completo (Opcional)

    @Column({ default: false })
    isGuest: boolean;

    @Column({ nullable: true })
    deviceId: string;

    @Column({ nullable: true, select: false })
    currentHashedRefreshToken: string;

    @Column({ default: 0 })
    currentStreak: number;

    @Column({ default: 0 })
    longestStreak: number;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    @Column({ nullable: true })
    lastActiveAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @OneToMany(() => Timer, (timer) => timer.user)
    timers: Timer[];

    @OneToMany(() => Tag, (tag) => tag.user)
    tags: Tag[];

    @OneToMany(() => Setting, (setting) => setting.user)
    settings: Setting[];

    @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
    achievements: UserAchievement[];
}