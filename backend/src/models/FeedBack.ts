import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message!: string;

}
