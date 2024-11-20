import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import PlantHealthLog from './PlantHealth';

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message!: string;

    @ManyToOne(() => PlantHealthLog, (healthLog) => healthLog.feedbacks)
    healthLog!: PlantHealthLog;
}
