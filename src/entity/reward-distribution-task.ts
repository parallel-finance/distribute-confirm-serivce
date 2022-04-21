import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'reward_distribution_task' })
export class RewardDistributionTask extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'crowdloan_id', type: 'varchar' })
  crowdloanId!: string;

  @Column({ name: 'ori_address', type: 'varchar' })
  oriAddress!: string;

  @Column({ name: 'dst_address', type: 'varchar' })
  dstAddress!: string;

  @Column({ name: 'tx_hash', type: 'varchar', nullable: true })
  txHash: string;

  @Column({ type: 'varchar' })
  amount: string;

  @Column({ type: 'varchar' })
  status: 'Pending' | 'Verified' | 'Committed' | 'Succeed' | 'Failed';

  @CreateDateColumn({name: 'create_at'})
  createAt: Date;

  @UpdateDateColumn({name: 'update_at'})
  updateAt: Date;
}
