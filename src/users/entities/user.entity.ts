import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { Timer } from '../../timers/entities/timer.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { UserAchievement } from '../../gamification/entities/user-achievement.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Mantenemos 'name' (Username) para compatibilidad, pero aplicamos la lógica nullable del snippet
    @Column({ unique: true, nullable: true })
    name!: string;

    @Column({ unique: true, nullable: true })
    email!: string;

    @Column({ nullable: true, select: false })
    password!: string;

    // Mantenemos 'fullName' para compatibilidad con tu sistema actual
    @Column({ nullable: true })
    fullName?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ default: false })
    isGuest!: boolean;

    // --- Nuevos campos solicitados en tu snippet ---

    @Column({ nullable: true })
    deviceId?: string;

    @Column({ nullable: true, select: false })
    currentHashedRefreshToken?: string;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    // --- Gamification Stats (Optimizados para v0.4 Leaderboard) ---

    @Index() // Optimización clave para ordenar el ranking rápidamente
    @Column({ default: 0 })
    experience!: number;

    @Index() // Optimización clave para el ranking de pomodoros
    @Column({ default: 0 })
    pomodorosCompleted!: number;

    // --- Streaks ---

    @Column({ default: 0 })
    currentStreak!: number;

    @Column({ default: 0 })
    longestStreak!: number;

    @Column({ type: 'timestamp', nullable: true })
    lastActiveDate!: Date; // Equivalente a lastActiveAt

    // --- Relations ---

    @OneToMany(() => Timer, (timer) => timer.user)
    timers!: Timer[];

    @OneToMany(() => Task, (task) => task.user)
    tasks!: Task[];

    @OneToMany(() => Tag, (tag) => tag.user)
    tags!: Tag[];

    @OneToMany(() => Setting, (setting) => setting.user)
    settings!: Setting[];

    @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
    achievements!: UserAchievement[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}