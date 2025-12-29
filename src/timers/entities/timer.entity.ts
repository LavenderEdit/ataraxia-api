import { User } from '../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Timer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    tag: string; // Ej: "Estudio", "Trabajo"

    @Column({ type: 'int' })
    duration: number; // Duración en segundos

    @Column({ type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ default: 'completed' })
    status: string; // 'completed', 'interrupted'

    @CreateDateColumn()
    createdAt: Date;

    // Relación: Muchos Timers pertenecen a Un Usuario
    @ManyToOne(() => User, (user) => user.timers, { onDelete: 'CASCADE' })
    user: User;
}