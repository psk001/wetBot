import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    chatId: number;

    @Column()
    city: string;

    @Column()
    status: string
}
