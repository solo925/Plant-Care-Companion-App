import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Feedback } from './FeedBack';
import { Plant } from './Plant';
import { User } from './User';

@Entity()
export class PlantHealthLog {
    @PrimaryGeneratedColumn()
    id!: string

    @Column({ type: 'text', nullable: true })
    leafColor?: string;

    @Column({ type: 'text', nullable: true })
    growthProgress?: string;

    @Column({ type: 'text', nullable: true })
    moistureLevel?: string;

    @Column({ type: 'text', nullable: true })
    pestPresence?: string;

    @Column({ type: 'text', nullable: true })
    otherNotes?: string;

    @CreateDateColumn()
    observationDate!: Date;

    @ManyToOne(() => Plant, (plant) => plant.healthLogs, { onDelete: 'CASCADE' })
    plant!: Plant | null;

    @ManyToOne(() => User, (user) => user.healthLogs, { onDelete: 'CASCADE' })
    user!: User | null;

    @OneToMany(() => Feedback, (feedback) => feedback.healthLog, { onDelete: 'CASCADE' })
    feedbacks!: Feedback[];
}

export default PlantHealthLog;
