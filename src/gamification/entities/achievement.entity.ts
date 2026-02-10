import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

export enum AchievementType {
    STREAK = 'streak',
    POMODORO_COUNT = 'pomodoro_count',
    // FUTURO: Podríamos agregar más tipos como "FIRST_LOGIN", "REFERRAL", etc.
}

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // Ej: 'STREAK_5', 'POMO_100'

    @Column()
    name: string; // Ej: 'Racha de Fuego'

    @Column()
    description: string; // Ej: 'Mantén una racha de 5 días'

    @Column({ nullable: true }) // Hacemos nullable por seguridad si aún no hay imagen
    driveFileId: string;

    @Column({
        type: 'enum',
        enum: AchievementType,
        default: AchievementType.STREAK,
    })
    type: AchievementType;

    @Column({ type: 'int', default: 0 })
    threshold: number; // Ej: 5 (para 5 días), 100 (para 100 pomodoros)

    @OneToMany(() => UserAchievement, (ua) => ua.achievement)
    userAchievements: UserAchievement[];
}