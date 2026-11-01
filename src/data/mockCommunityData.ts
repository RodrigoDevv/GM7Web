import {
  CommunityGroup,
  Discussion,
  CommunityEvent,
  SpotlightMember,
  ActivityPost,
  ShowcaseProject,
  UserProfile
} from '../types/community';

export const initialCommunities: CommunityGroup[] = [
  {
    id: 'grp-1',
    name: 'Modern Web Engineering',
    slug: 'web-engineering',
    category: 'engineering',
    description: 'High-performance React, Next.js, TypeScript patterns, WebAssembly, and modern browser APIs.',
    memberCount: 14820,
    discussionCount: 3410,
    iconName: 'Code2',
    bannerColor: '#386BFF',
    accentColor: '#386BFF',
    isJoined: true,
    tags: ['React', 'TypeScript', 'Performance', 'Vite'],
    moderators: ['Elena Rostova', 'Marcus Chen']
  },
  {
    id: 'grp-2',
    name: 'Design Systems & UX',
    slug: 'design-systems',
    category: 'design',
    description: 'Design tokens, Figma workflows, micro-interactions, accessibility standards, and spatial UI aesthetics.',
    memberCount: 11450,
    discussionCount: 2280,
    iconName: 'Palette',
    bannerColor: '#8B5CF6',
    accentColor: '#8B5CF6',
    isJoined: false,
    tags: ['Figma', 'Tokens', 'Accessibility', 'Interaction'],
    moderators: ['Sofia Lind', 'Amara Okafor']
  },
  {
    id: 'grp-3',
    name: 'AI & Generative Systems',
    slug: 'ai-systems',
    category: 'ai',
    description: 'Building practical agentic pipelines, multimodal models, embedding search, and frontier generative apps.',
    memberCount: 18940,
    discussionCount: 4620,
    iconName: 'Cpu',
    bannerColor: '#386BFF',
    accentColor: '#8B5CF6',
    isJoined: true,
    tags: ['LLMs', 'Agents', 'Embeddings', 'Prompting'],
    moderators: ['Julian Vance', 'Dr. Kenji Sato']
  },
  {
    id: 'grp-4',
    name: 'Indie Founders & Builders',
    slug: 'founders',
    category: 'founders',
    description: 'Bootstrapping, customer discovery, shipping velocity, monetization strategies, and product mechanics.',
    memberCount: 8930,
    discussionCount: 1840,
    iconName: 'Compass',
    bannerColor: '#FFBE0D',
    accentColor: '#FFBE0D',
    isJoined: false,
    tags: ['Bootstrapping', 'SaaS', 'Revenue', 'Launch'],
    moderators: ['Devon Cole', 'Rachel Adams']
  },
  {
    id: 'grp-5',
    name: 'Creative Code & Physical Tech',
    slug: 'creative-hardware',
    category: 'hardware',
    description: 'Synthesizers, modular hardware, Three.js shaders, microcontrollers, and tangible human-computer interfaces.',
    memberCount: 6240,
    discussionCount: 1120,
    iconName: 'Sliders',
    bannerColor: '#8B5CF6',
    accentColor: '#FFBE0D',
    isJoined: false,
    tags: ['Three.js', 'Hardware', 'Audio DSP', 'Robotics'],
    moderators: ['Taro Tanaka', 'Lena Meyer']
  },
  {
    id: 'grp-6',
    name: 'Spatial Computing & 3D Web',
    slug: 'spatial-web',
    category: 'gaming',
    description: 'WebXR, WebGPU graphics pipelines, interactive physics simulations, and immersive spatial web engines.',
    memberCount: 7120,
    discussionCount: 940,
    iconName: 'Box',
    bannerColor: '#386BFF',
    accentColor: '#386BFF',
    isJoined: false,
    tags: ['WebGPU', 'WebXR', 'Shaders', 'Physics'],
    moderators: ['Kasper Lindgren', 'Zack Taylor']
  }
];

export const initialDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    title: 'How are teams orchestrating client-side latency budgets with Next 15 / React 19 actions?',
    content: 'We recently measured a 140ms round-trip increase when migrating complex form validation to server actions without optimistic updates. Here are three orchestration patterns our team evaluated, including an optimistic rolling window cache.',
    groupName: 'Modern Web Engineering',
    groupId: 'grp-1',
    author: {
      name: 'Marcus Chen',
      handle: '@mchen_dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Staff Frontend Architect',
      badge: 'Core Contributor'
    },
    tags: ['React 19', 'Performance', 'Architecture'],
    replyCount: 28,
    likesCount: 142,
    isLiked: false,
    isSaved: false,
    createdAt: '2 hours ago',
    replies: [
      {
        id: 'rep-1',
        author: {
          name: 'Elena Rostova',
          handle: '@elena_design',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          role: 'Design Technologist'
        },
        content: 'We paired React 19 `useOptimistic` with an event-driven queue. The key was decoupling the immediate touch response from the background mutation confirmation.',
        createdAt: '1 hour ago',
        likes: 19,
        isLiked: false
      },
      {
        id: 'rep-2',
        author: {
          name: 'Amara Okafor',
          handle: '@amara_ux',
          avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
          role: 'Systems Engineer'
        },
        content: 'Great writeup! Did you notice any memory footprint variances when holding speculative state during multiple concurrent actions?',
        createdAt: '45 mins ago',
        likes: 7,
        isLiked: false
      }
    ]
  },
  {
    id: 'disc-2',
    title: 'Design token hierarchy: Resolving semantic intent vs component-specific overrides',
    content: 'A deep-dive into how we structured 340+ tokens across 4 themes without ballooning bundle size. We settled on Global -> Alias (Semantic) -> Component Tier, with strict linting rules on component consumption.',
    groupName: 'Design Systems & UX',
    groupId: 'grp-2',
    author: {
      name: 'Sofia Lind',
      handle: '@sofia_systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Head of Design Tokens',
      badge: 'Design Lead'
    },
    tags: ['Design Tokens', 'Figma', 'CSS Architecture'],
    replyCount: 34,
    likesCount: 218,
    isLiked: true,
    isSaved: true,
    createdAt: '4 hours ago',
    replies: [
      {
        id: 'rep-3',
        author: {
          name: 'Kasper Lindgren',
          handle: '@kasper_graphics',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'Shader Engineer'
        },
        content: 'The 3-tier model is the only one that survived our recent multi-brand rebranding. Huge +1 on automated Style Dictionary integration.',
        createdAt: '2 hours ago',
        likes: 12,
        isLiked: false
      }
    ]
  },
  {
    id: 'disc-3',
    title: 'Evaluating small local SLMs for in-browser contextual assistance (WebGPU + ONNX)',
    content: 'We benchmarked 1.5B parameter models running client-side with 0ms egress cost. Latency settled under 45ms per token on modern hardware. Here are our reproducible benchmarks and memory profiles.',
    groupName: 'AI & Generative Systems',
    groupId: 'grp-3',
    author: {
      name: 'Julian Vance',
      handle: '@jvance_ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'AI Infrastructure Lead',
      badge: 'Moderator'
    },
    tags: ['WebGPU', 'Edge AI', 'Local Models'],
    replyCount: 42,
    likesCount: 310,
    isLiked: false,
    isSaved: false,
    createdAt: '7 hours ago',
    replies: []
  },
  {
    id: 'disc-4',
    title: 'Lessons after shipping to first 1,000 paid subscribers as a solo engineer',
    content: 'No complex microservices, no multi-region databases. Just a clean single-node server, SQLite via Turso, and disciplined focus on user friction points. Here are the 5 unglamorous things that moved conversion by 34%.',
    groupName: 'Indie Founders & Builders',
    groupId: 'grp-4',
    author: {
      name: 'Devon Cole',
      handle: '@devon_builds',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      role: 'Founder @ StackFlow',
      badge: 'Top Creator'
    },
    tags: ['Bootstrapping', 'SaaS', 'Revenue'],
    replyCount: 56,
    likesCount: 425,
    isLiked: true,
    isSaved: false,
    createdAt: '12 hours ago',
    replies: []
  }
];

export const initialEvents: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Building Resilient Micro-Interactions with Modern Web APIs',
    type: 'workshop',
    description: 'Hands-on live coding workshop building accessible, spring-based gestures, view transitions, and 60fps animations with zero layout thrashing.',
    date: '2026-10-16',
    displayDate: {
      month: 'OCT',
      day: '16',
      time: '17:00 UTC'
    },
    location: 'Kinetic Live Virtual Auditorium',
    isVirtual: true,
    host: {
      name: 'Elena Rostova',
      role: 'Staff Interaction Designer',
      company: 'Kinetic Labs',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    attendeeCount: 480,
    maxAttendees: 600,
    isRegistered: true,
    tags: ['Workshop', 'Interactions', 'CSS/JS'],
    image: '/src/assets/images/community_event_stage_1791557420746.jpg'
  },
  {
    id: 'evt-2',
    title: 'Frontier AI Agents in Production: From Benchmarks to Live Systems',
    type: 'keynote',
    description: 'A technical deep-dive into autonomous tool use, deterministic guardrails, structured memory caching, and real-world failure modes.',
    date: '2026-10-22',
    displayDate: {
      month: 'OCT',
      day: '22',
      time: '18:30 UTC'
    },
    location: 'Stream Stage + San Francisco Hub',
    isVirtual: true,
    host: {
      name: 'Dr. Kenji Sato',
      role: 'Principal Research Scientist',
      company: 'Neural Foundry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    attendeeCount: 1240,
    maxAttendees: 1500,
    isRegistered: false,
    tags: ['Keynote', 'AI Agents', 'Architecture'],
    image: '/src/assets/images/community_event_stage_1791557420746.jpg'
  },
  {
    id: 'evt-3',
    title: 'Global Community Hackathon: Tangible Hardware & Ambient Interfaces',
    type: 'hackathon',
    description: '48-hour global sprint creating sensory web software, tactile controllers, and audio-reactive interfaces. Over $15k in community grants.',
    date: '2026-11-05',
    displayDate: {
      month: 'NOV',
      day: '05',
      time: '09:00 UTC'
    },
    location: 'Global Virtual + Regional Satellite Lounges',
    isVirtual: true,
    host: {
      name: 'Lena Meyer',
      role: 'Creative Technologist',
      company: 'Studio Tactile',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    attendeeCount: 890,
    maxAttendees: 1000,
    isRegistered: false,
    tags: ['Hackathon', 'Hardware', 'Prizes']
  },
  {
    id: 'evt-4',
    title: 'Ask Me Anything: Scaling Solo SaaS to $50k MRR Without VC Funding',
    type: 'ama',
    description: 'Direct Q&A on pricing psychology, distribution channels, churn reduction, and automated customer success loops.',
    date: '2026-11-12',
    displayDate: {
      month: 'NOV',
      day: '12',
      time: '16:00 UTC'
    },
    location: 'Discord Voice & Video Lounge',
    isVirtual: true,
    host: {
      name: 'Devon Cole',
      role: 'Founder',
      company: 'StackFlow',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
    },
    attendeeCount: 310,
    isRegistered: false,
    tags: ['AMA', 'Bootstrapping', 'SaaS']
  }
];

export const initialSpotlightMembers: SpotlightMember[] = [
  {
    id: 'mem-1',
    name: 'Elena Rostova',
    handle: '@elena_rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Design System Architect',
    companyOrProject: 'Creator of Kinetic DS',
    location: 'Berlin, Germany',
    bio: 'Crafting token engines and high-framerate spatial interfaces. Open-source maintainer and mentor for junior designers.',
    contributions: 184,
    reputation: 4920,
    isFollowing: true,
    badges: ['Top Contributor', 'Design Mentor'],
    recentWork: 'Kinetic DS v2.0 - Multi-brand token pipeline'
  },
  {
    id: 'mem-2',
    name: 'Marcus Chen',
    handle: '@marcus_chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Staff Web Architect',
    companyOrProject: 'Principal @ Vektor Labs',
    location: 'Vancouver, Canada',
    bio: 'Obsessed with sub-50ms web page loads, zero-runtime CSS, and distributed edge state synchronization.',
    contributions: 246,
    reputation: 6180,
    isFollowing: false,
    badges: ['Web Guild Lead', 'Core Speaker'],
    recentWork: 'React 19 Optimistic Mutation Architecture'
  },
  {
    id: 'mem-3',
    name: 'Taro Tanaka',
    handle: '@taro_audio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Hardware Maker & DSP Dev',
    companyOrProject: 'Synthesis Protocol Co.',
    location: 'Kyoto, Japan',
    bio: 'Designing tactile aluminum synthesizers and in-browser WebAudio sequencers with ultra-low jitter.',
    contributions: 92,
    reputation: 3410,
    isFollowing: false,
    badges: ['Maker Laureate', 'Hardware Pioneer'],
    recentWork: 'Protocol-01: Modular Tactile Sequencer'
  },
  {
    id: 'mem-4',
    name: 'Amara Okafor',
    handle: '@amara_ai',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    role: 'Generative Systems Researcher',
    companyOrProject: 'Aurora Flow Project',
    location: 'London, UK',
    bio: 'Exploring node-based generative aesthetics, neural texture synthesis, and interactive canvas pipelines.',
    contributions: 135,
    reputation: 5200,
    isFollowing: true,
    badges: ['AI Scholar', 'Community Fellow'],
    recentWork: 'Node Synth: Generative Visual Canvas'
  }
];

export const initialShowcaseProjects: ShowcaseProject[] = [
  {
    id: 'prj-1',
    title: 'Kinetic Design System 2.0',
    tagline: 'Production-ready tokenized component library with zero runtime overhead',
    description: 'A comprehensive multi-platform design system powered by Tailwind CSS tokens, automated contrast auditing, and 45 accessible primitive components.',
    author: {
      name: 'Elena Rostova',
      handle: '@elena_rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'Design System Architect'
    },
    imageUrl: '/src/assets/images/showcase_project_ambient_1791557391148.jpg',
    tags: ['Design System', 'Tokens', 'TypeScript', 'Tailwind'],
    upvotes: 384,
    isUpvoted: true,
    demoUrl: 'https://kinetic-ds.preview.dev',
    sourceUrl: 'https://github.com/kinetic-community/kinetic-ds',
    featured: true
  },
  {
    id: 'prj-2',
    title: 'Node Synth & Generative Canvas',
    tagline: 'Visual node graph engine for high-resolution generative textures and sound',
    description: 'An interactive browser-based node editor connecting WebGPU compute shaders with WebAudio modulation matrix, capable of 4K real-time generative output.',
    author: {
      name: 'Amara Okafor',
      handle: '@amara_ai',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      role: 'Systems Researcher'
    },
    imageUrl: '/src/assets/images/showcase_project_ai_canvas_1791557402342.jpg',
    tags: ['WebGPU', 'Generative', 'Node Editor', 'Audio DSP'],
    upvotes: 512,
    isUpvoted: false,
    demoUrl: 'https://node-synth.creative.dev',
    sourceUrl: 'https://github.com/kinetic-community/node-synth',
    featured: true
  },
  {
    id: 'prj-3',
    title: 'Protocol-01 Tactile Sequencer',
    tagline: 'Open-hardware 8-step analog synthesizer controller with USB-C WebMIDI bridge',
    description: 'Milled aircraft aluminum enclosure housing mechanical switches, linear faders, and an embedded ESP32 streaming real-time parameter changes straight to web browsers.',
    author: {
      name: 'Taro Tanaka',
      handle: '@taro_audio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Hardware Maker'
    },
    imageUrl: '/src/assets/images/showcase_project_eco_hardware_1791557411923.jpg',
    tags: ['Open Hardware', 'WebMIDI', 'ESP32', 'Audio'],
    upvotes: 295,
    isUpvoted: false,
    demoUrl: 'https://synth-protocol.hardware.dev',
    sourceUrl: 'https://github.com/kinetic-community/synth-protocol-hw',
    featured: false
  }
];

export const initialActivityPosts: ActivityPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Elena Rostova',
      handle: '@elena_rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      title: 'Design System Architect'
    },
    type: 'project',
    title: 'Just released Kinetic DS 2.0 with full dark-mode token audits!',
    content: 'After 3 months of prototyping with 60 community testers, we shipped our updated token resolver. It reduces theme switching flicker to 0ms and calculates WCAG contrast dynamically at compile time.',
    image: '/src/assets/images/showcase_project_ambient_1791557391148.jpg',
    tags: ['Design System', 'Release', 'TypeScript'],
    likes: 88,
    commentsCount: 16,
    sharesCount: 12,
    isLiked: true,
    isBookmarked: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'post-2',
    author: {
      name: 'Julian Vance',
      handle: '@jvance_ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      title: 'AI Infrastructure Lead'
    },
    type: 'question',
    title: 'How are you handling tool invocation rate limits across agent clusters?',
    content: 'When spinning up 20+ parallel evaluation subagents, we keep hitting third-party downstream rate walls. Are you leaning toward token bucket proxies at the edge, or localized priority queues in Redis?',
    tags: ['AI Agents', 'Architecture', 'Infrastructure'],
    likes: 47,
    commentsCount: 23,
    sharesCount: 5,
    isLiked: false,
    isBookmarked: true,
    createdAt: '3 hours ago'
  },
  {
    id: 'post-3',
    author: {
      name: 'Devon Cole',
      handle: '@devon_builds',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      title: 'Founder @ StackFlow'
    },
    type: 'announcement',
    title: 'Community Grant applications for Q4 are officially open',
    content: 'We are allocating $25,000 in micro-grants ($1,000–$5,000 each) to open-source developers building developer tooling, accessible component libraries, or educational simulations. No pitch decks required.',
    tags: ['Grants', 'Open Source', 'Community'],
    likes: 154,
    commentsCount: 39,
    sharesCount: 44,
    isLiked: true,
    isBookmarked: true,
    createdAt: '6 hours ago'
  }
];

export const defaultCurrentUser: UserProfile = {
  name: 'Alex Rivera',
  handle: '@alexrivera',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'Full-Stack Developer & Community Member',
  bio: 'Building web apps, exploring local AI runtimes, and contributing to open-source design systems.',
  joinedDate: 'Joined March 2026',
  joinedGroups: ['grp-1', 'grp-3'],
  followingMembers: ['mem-1'],
  savedDiscussions: ['disc-2'],
  registeredEvents: ['evt-1']
};
