import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.sentMessages)
    sender!: User;

    @ManyToOne(() => User, (user) => user.receivedMessages)
    recipient!: User;

    @OneToMany(() => User, (user) => user.receivedMessages)
    user!: User;

    @ManyToOne(() => User, (user) => user.messages, { eager: true, onDelete: 'CASCADE' })
    masageuser!: User;

    @ManyToOne(() => Room, (room) => room.messages, { eager: true, onDelete: 'CASCADE' })
    room!: Room;

}
