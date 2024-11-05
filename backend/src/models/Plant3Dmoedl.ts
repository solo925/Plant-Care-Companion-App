import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from './Plant';

@Entity()
export class Plant3DModel {
    @PrimaryGeneratedColumn()
    model_id!: number;

    @ManyToOne(() => Plant, (plant) => plant.models, { onDelete: 'CASCADE' })
    plant!: Plant;

    @Column({ type: 'varchar', length: 10 })
    model_format!: string;

    @Column({ type: 'varchar', length: 255 })
    model_file_path!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}

export default Plant3DModel;
