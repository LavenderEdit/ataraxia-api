import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

export enum AchievementType {
    STREAK = 'streak',
    POMODORO_COUNT = 'pomodoro_count',
    // Puedes añadir más tipos aquí (ej: 'early_bird', 'night_owl')
}

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string; // Ej: 'STREAK_5', 'POMO_100'

    @Column()
    name: string; // Ej: 'Racha de Fuego'

    @Column()
    description: string; // Ej: 'Mantén una racha de 5 días'

    @Column()
    driveFileId: string; // El ID del archivo en Google Drive (tu variable nueva)

    @Column({
        type: 'enum',
        enum: AchievementType,
        default: AchievementType.STREAK,
    })
    type: AchievementType;

    @Column()
    threshold: number; // Ej: 5 (para 5 días), 100 (para 100 pomodoros)

    @OneToMany(() => UserAchievement, (ua) => ua.achievement)
    userAchievements: UserAchievement[];
}