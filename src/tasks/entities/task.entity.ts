import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    Index,
    DeleteDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Timer } from '../../timers/entities/timer.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ default: false })
    completed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @Index()
    @Column({ nullable: true })
    userId!: string;

    @Column({ nullable: true })
    tag!: string;

    // Relación vinculada a la columna explícita userId
    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @OneToMany(() => Timer, (timer) => timer.task)
    timers!: Timer[];

    // NUEVO v0.2: Soft Delete
    @DeleteDateColumn()
    deletedAt!: Date;
}