import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Plant from './Plant';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column({ nullable: true }) // Make profile photo optional
    profilePhoto?: string; // Add this line

    @OneToMany(() => Plant, (plant) => plant.user)
    plants!: Plant[];
}

export default User;
