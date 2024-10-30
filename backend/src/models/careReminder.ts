import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Plant from './Plant';

@Entity()
export class CareReminder {
    @PrimaryGeneratedColumn()
    id!: number;

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

    @ManyToOne(() => Plant, (plant) => plant.careReminder, { onDelete: 'CASCADE' })
    plant!: Plant;
}

export default CareReminder;
