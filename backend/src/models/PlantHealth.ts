import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from './Plant';
import { User } from './User';

@Entity()
export class PlantHealthLog {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: 'text' })
    healthStatus!: string;

    @Column({ type: 'float' })
    percentage!: number;

    @Column({ type: 'text', nullable: true })
    possibleCauses?: string;

    @Column({ type: 'text', nullable: true })
    preventiveMeasures?: string;

    @CreateDateColumn()
    observationDate!: Date;

    @ManyToOne(() => Plant, (plant) => plant.healthLogs, { onDelete: 'CASCADE' })
    plant!: Plant;

    @ManyToOne(() => User, (user) => user.healthLogs, { onDelete: 'CASCADE' })
    user!: User;
}

export default PlantHealthLog;
