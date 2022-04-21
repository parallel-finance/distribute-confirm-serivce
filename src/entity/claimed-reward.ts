import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'claimed_reward' })
export class ClaimedReward extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'claim_tx_hash', type: 'varchar', nullable: true })
  txHash: string;

  @Column({ name: 'crowdloan_id', type: 'varchar' })
  crowdloanId: string;

  @Column({ type: 'varchar' })
  amount: string;

  @Column({ name: 'received_address', type: 'varchar' })
  receivedAddress: string;

  @Column({ name: 'create_at', type: 'timestamptz' })
  createAt: Date;
}
