import type { Role } from '@prisma/client';

export interface IGroupMember {
  role: Role;
  id: string;
  avatarImg: string;
  [key: string]: any;
}

export interface IGroupBase {
  id: string;
  name: string;
  authorId: string;
  author?: {
    [key: string]: any;
  };
  profileImage: string | null;
  coverImage: string | null;
  bio: string;
  // createdAt: Date;
  // updatedAt: Date | null;

  createdAt: string | null;
  updatedAt: string | null;
}

export interface IGroupWithCount extends IGroupBase {
  _count: {
    [key: string]: number;
  };
}

export interface IGroupWithMembers extends IGroupBase {
  members: IGroupMember[];
}

export interface IGroupWithMembersAndCount
  extends IGroupBase,
    IGroupWithCount,
    IGroupWithMembers {}

export type IGroup =
  | IGroupBase
  | IGroupWithCount
  | IGroupWithMembers
  | IGroupWithMembersAndCount
  | null;

export interface IGroupContent {
  group: IGroupWithCount & IGroupWithMembers;
}
