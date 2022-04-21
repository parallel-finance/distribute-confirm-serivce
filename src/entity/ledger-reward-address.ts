import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ledger_reward_address' })
export class LedgerRewardAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ori_address' })
  oriAddress: string;

  @Column({ name: 'dst_address' })
  dstAddress: string;

  @Column({ name: 'block_height' })
  blockHeight: number;
}
