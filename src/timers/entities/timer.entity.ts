import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
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

    @ManyToOne(() => User, (user) => user.timers, { onDelete: 'CASCADE' })
    user: User;

    // ESTO FALTABA: La relación con Task
    @ManyToOne(() => Task, (task) => task.timers, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'taskId' }) // Esto ayuda a que TypeORM mapee automáticamente taskId del DTO
    task: Task;

    @Column({ nullable: true })
    taskId: string; // Columna explícita para facilitar lecturas
}