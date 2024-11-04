import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './User';
import CareReminder from './careReminder';

@Entity()
export class Plant {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    species!: string;

    @Column()
    wateringFrequency!: string;

    @Column({ type: 'timestamp', nullable: true })
    lastWatered!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
    user!: User;

    @OneToMany(() => CareReminder, (reminder) => reminder.plant)
    reminders!: CareReminder[];
    careReminder: any;
}

export default Plant;
