import { Column, Entity, PrimaryColumn } from 'typeorm';

export type ResolutionCodeType = 'PT15M' | 'PT30M' | 'PT60M';

@Entity()
export class Country {
  @PrimaryColumn({ type: 'char', length: 2 })
  id: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: true,
    default: null,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: ['PT15M', 'PT30M', 'PT60M'],
    default: 'PT60M',
  })
  resolution_code: ResolutionCodeType;
}
