import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'moonbeam_reward_address' })
export class MoonbeamRewardAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: 'account', type: 'varchar', length: 100 })
  oriAddress!: string;

  @Column({ name: 'reward_address', type: 'varchar', length: 100 })
  dstAddress!: string;

  @Column({ type: 'int', name: 'block_height' })
  blockHeight!: number;
}
