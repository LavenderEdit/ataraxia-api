import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Timer } from '../../timers/entities/timer.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    name?: string;

    @Column({ unique: true, nullable: true })
    email?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    deviceId?: string;

    @Column({ default: false })
    isGuest: boolean;

    @OneToMany(() => Timer, (timer) => timer.user)
    timers: Timer[];

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @OneToOne(() => Setting, (setting) => setting.user)
    settings: Setting;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}