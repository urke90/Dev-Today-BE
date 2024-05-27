export enum EContentTypeLowercase {
  POST = 'post',
  MEETUP = 'meetup',
  PODCAST = 'podcast',
}

export interface GroupMember {
  user: {
    id: string;
    avatarImg: string;
  };
}

export interface Group {
  id: string;
  name: string;
  coverImg: string;
  groupBio: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    members: number;
  };
  members: GroupMember[];
}

export interface GroupContent {
  group: Group;
}
