import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Plant from './Plant';
import User from './User';

@Entity()
export class CareReminder {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    reminderDate!: Date;

    @Column()
    plantId!: number;

    @Column()
    reminderType!: string;

    @Column()
    frequency!: string;

    @Column({ type: 'timestamp', nullable: true })
    nextReminder!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;


    @Column({ type: 'text', nullable: true })
    description!: string;

    @ManyToOne(() => User, (user) => user.careReminder, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Plant, (plant) => plant.careReminder, { onDelete: 'CASCADE' })
    plant!: Plant;
}

export default CareReminder;
