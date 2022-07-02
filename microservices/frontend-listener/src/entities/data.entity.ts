import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Data {
  @PrimaryColumn()
  dataset: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
