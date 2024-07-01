export enum EContentTypeLowercase {
  POST = 'post',
  MEETUP = 'meetup',
  PODCAST = 'podcast',
}
export enum EPageTypeLowercase {
  POSTS = 'posts',
  MEETUPS = 'meetups',
  PODCASTS = 'podcasts',
}

export type CommonData = {
  popularTagsSorted: { id: string; title: string; count: number }[];
  popularGroupsSorted: { id: string; name: string; count: number }[];
  popularPosts?: {
    id: string;
    title: string;
    coverImage: string | null;
    author: { userName: string };
  }[];
  popularMeetups?: {
    id: string;
    title: string;
    coverImage: string | null;
    tags: { id: string; title: string }[];
    meetupLocation: string | null;
    meetupDate: Date | null;
  }[];
  podcasts?: {
    id: string;
    title: string;
    coverImage: string | null;
    author: { userName: string };
  }[];
};
