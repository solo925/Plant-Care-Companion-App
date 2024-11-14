import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import CareReminder from './careReminder';
import Plant3DModel from './Plant3Dmoedl';
import PlantHealthLog from './PlantHealth';
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
    lastWatered!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'text', nullable: true })
    growingConditions?: string;

    @Column({ nullable: true })
    size?: string;

    @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
    user!: User;

    @OneToMany(() => Plant3DModel, (models) => models.plant, { onDelete: 'CASCADE' })
    models!: Plant3DModel[]

    @OneToMany(() => PlantHealthLog, (healthLog) => healthLog.plant)
    healthLogs!: PlantHealthLog[];


    @OneToMany(() => CareReminder, (reminder) => reminder.plant)
    reminders!: CareReminder[];
    careReminder: any;
}

export default Plant;
