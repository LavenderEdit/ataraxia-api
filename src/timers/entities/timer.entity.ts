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
    tag: string;

    @Column({ type: 'int' })
    duration: number;

    @Column({ type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ default: 'completed' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.timers, { onDelete: 'CASCADE' })
    user: User;
}