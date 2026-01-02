import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    color: string;

    @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}