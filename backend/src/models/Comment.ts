import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content!: string;

    @Column({ nullable: true })
    image?: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.comments)
    author!: User;

    @ManyToOne(() => Post, (post) => post.comments)
    post!: Post;
}
