import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_project_reward_info' })
export class UserProjectRewardInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'ori_address', type: 'varchar' })
  oriAddress!: string;

  @Column({ name: 'crowdloan_id', type: 'varchar' })
  crowdloanId!: string;

  @Column({ name: 'project_reward_ratio', type: 'float' })
  projectRewardRatio!: string;
}
