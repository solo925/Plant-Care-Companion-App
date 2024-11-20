import bcrypt from 'bcrypt';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import CareReminder from './careReminder';
import { Comment } from './Comment';
import { Message } from './Message';
import Plant from './Plant';
import PlantHealthLog from './PlantHealth';
import { Post } from './Post';
import { Room } from './Room';

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

    @Column({ nullable: true })
    profilePhoto?: string;




    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    resetPasswordExpires?: Date;


    @OneToMany(() => Plant, (plant) => plant.user)
    plants!: Plant[];

    @ManyToMany(() => Plant, (plant) => plant.owners)
    @JoinTable()
    ownedPlants!: Plant[];

    @OneToMany(() => CareReminder, (reminder) => reminder.user)
    reminders!: CareReminder[];
    careReminder: any;


    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments!: Comment[];

    @ManyToMany(() => Room, (room) => room.users)
    rooms!: Room[];

    @OneToMany(() => Message, (message) => message.sender)
    sentMessages!: Message[];

    @OneToMany(() => Message, (message) => message.recipient)
    receivedMessages!: Message[];

    @OneToMany(() => Message, (message) => message.user)
    messages!: Message[];

    @OneToMany(() => PlantHealthLog, (healthLog) => healthLog.user)
    healthLogs!: PlantHealthLog[];


    async setPassword(newPassword: string): Promise<void> {
        this.password = await bcrypt.hash(newPassword, 10);
    }
}

export default User;
