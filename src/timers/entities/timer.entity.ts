import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('timers')
export class Timer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    duration: number; // Duration in seconds

    @Column({ default: 'completed' })
    status: string; // 'completed', 'interrupted'

    @CreateDateColumn()
    startTime: Date;

    @Column({ nullable: true })
    endTime: Date;

    @Column({ nullable: true })
    tag: string;

    @Index()
    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, (user) => user.timers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // OPTIMIZACIÓN v0.2: Índice para calcular tiempo total por tarea rápidamente
    @Index()
    @Column({ nullable: true })
    taskId: string;

    @ManyToOne(() => Task, (task) => task.timers, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'taskId' })
    task: Task;
}