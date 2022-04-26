import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Data {
  @ManyToOne(() => Country, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @PrimaryColumn({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  value: string;
}
