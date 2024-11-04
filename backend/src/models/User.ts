import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Plant from './Plant';
import CareReminder from './careReminder';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: string;

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

    @OneToMany(() => CareReminder, (reminder) => reminder.user)
    reminders!: CareReminder[];
    careReminder: any;
}

export default User;
