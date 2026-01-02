import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('timer')
export class Timer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    tag: string;

    @Column()
    duration: number;

    @Column({ type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ default: 'completed' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, (user) => user.timers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}