import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import CareReminder from './careReminder';
import { Comment } from './Comment';
import { Message } from './Message';
import Plant from './Plant';
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

    @OneToMany(() => Plant, (plant) => plant.user)
    plants!: Plant[];

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
}

export default User;
