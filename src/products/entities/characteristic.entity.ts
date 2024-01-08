import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Characteristic {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Product, (product) => product.characteristics)
  products: Product[];
}
