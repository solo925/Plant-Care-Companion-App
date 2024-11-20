import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("text", { nullable: true })
    description?: string;

    @ManyToOne(() => User, (user) => user.rooms)
    creator!: User;

    @ManyToMany(() => User, (user) => user.rooms)
    @JoinTable()
    users!: User[];

    @OneToMany(() => Post, (post) => post.room)
    posts!: Post[];

    @OneToMany(() => Message, (message) => message.room)
    messages!: Message[];

}
