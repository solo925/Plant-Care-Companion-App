import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("text")
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ nullable: true })
    imageUrl?: string;


    @ManyToOne(() => User, (user) => user.posts)
    author!: User;

    @ManyToOne(() => Room, (room) => room.posts, { nullable: true })
    room!: Room | null;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];
}
