import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import CareReminder from './careReminder';
import Plant3DModel from './Plant3Dmoedl';
import User from './User';

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

    @OneToMany(() => Plant3DModel, (models) => models.plant, { onDelete: 'CASCADE' })
    models!: Plant3DModel[]

    @OneToMany(() => CareReminder, (reminder) => reminder.plant)
    reminders!: CareReminder[];
    careReminder: any;
}

export default Plant;
