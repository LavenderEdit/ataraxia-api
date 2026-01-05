import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Timer } from '../../timers/entities/timer.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    completed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    userId: string;

    @Column({ nullable: true })
    tag: string;

    @ManyToOne(() => User, (user) => user.tasks)
    user: User;

    @OneToMany(() => Timer, (timer) => timer.task)
    timers: Timer[];
}