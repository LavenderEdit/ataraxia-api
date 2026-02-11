import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
@Unique(['user', 'achievement']) // Un usuario no puede tener el mismo logro dos veces
export class UserAchievement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements)
    achievement: Achievement;

    @CreateDateColumn()
    unlockedAt: Date;
}