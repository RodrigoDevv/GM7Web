export interface CommunityGroup {
  id: string;
  name: string;
  slug: string;
  category: 'engineering' | 'design' | 'ai' | 'founders' | 'hardware' | 'gaming';
  description: string;
  memberCount: number;
  discussionCount: number;
  iconName: string;
  bannerColor: string;
  accentColor: string;
  isJoined?: boolean;
  tags: string[];
  moderators: string[];
}

export interface DiscussionReply {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  groupName: string;
  groupId: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: string;
    badge?: string;
  };
  tags: string[];
  replyCount: number;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  replies: DiscussionReply[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: 'workshop' | 'keynote' | 'meetup' | 'hackathon' | 'ama';
  description: string;
  date: string;
  displayDate: {
    month: string;
    day: string;
    time: string;
  };
  location: string;
  isVirtual: boolean;
  host: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  attendeeCount: number;
  maxAttendees?: number;
  isRegistered?: boolean;
  tags: string[];
  image?: string;
}

export interface SpotlightMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  companyOrProject: string;
  location: string;
  bio: string;
  contributions: number;
  reputation: number;
  isFollowing?: boolean;
  badges: string[];
  recentWork: string;
}

export interface ActivityPost {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    title: string;
  };
  type: 'project' | 'question' | 'announcement' | 'insight';
  title?: string;
  content: string;
  image?: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  comments?: DiscussionReply[];
}

export interface ShowcaseProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: string;
  };
  imageUrl: string;
  tags: string[];
  upvotes: number;
  isUpvoted?: boolean;
  demoUrl: string;
  sourceUrl?: string;
  featured?: boolean;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  role: string;
  bio: string;
  joinedDate: string;
  joinedGroups: string[];
  followingMembers: string[];
  savedDiscussions: string[];
  registeredEvents: string[];
}
