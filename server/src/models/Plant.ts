import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"; // Corrected import

@Entity()
export class Plant {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    scientificName?: string;

    @Column("text")
    careInstructions?: string;
}
