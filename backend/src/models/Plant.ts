import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './User';
import CareReminder from './careReminder'; // Import the CareReminder model

@Entity()
export class Plant {
    @PrimaryGeneratedColumn()
    id!: number;

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

    @OneToMany(() => CareReminder, (reminder) => reminder.plant) // Add this relationship
    reminders!: CareReminder[];
    careReminder: any;
}

export default Plant;
