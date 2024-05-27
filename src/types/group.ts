export interface IGroupMember {
  user: {
    id: string;
    avatarImg: string;
  };
}

export interface IGroup {
  id: string;
  name: string;
  coverImage: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    members: number;
  };
  members: IGroupMember[];
}

export interface IGroupContent {
  group: IGroup;
}
