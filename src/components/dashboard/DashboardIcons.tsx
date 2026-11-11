import React from 'react';

type DashboardIconProps = { className?: string };

const IconFrame: React.FC<DashboardIconProps & { children: React.ReactNode }> = ({ className = 'h-5 w-5', children }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const line = {
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const gold = {
  stroke: '#FFBE0D',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const OverviewIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.9" {...line} />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.9" {...line} />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.9" {...line} />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.9" fill="#FFBE0D" stroke="#FFBE0D" strokeWidth="1.75" />
  </IconFrame>
);

export const TournamentIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" fill="#FFBE0D" fillOpacity="0.16" {...line} />
    <path d="M7 5.5H4.5V7a3.6 3.6 0 0 0 3.3 3.58" {...line} />
    <path d="M17 5.5h2.5V7a3.6 3.6 0 0 1-3.3 3.58" {...line} />
    <path d="M12 14v3.2" {...line} />
    <path d="M8.5 20.5h7l-.8-3.3H9.3Z" {...line} />
  </IconFrame>
);

export const GamesIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M7.3 8h9.4a4 4 0 0 1 3.9 3.1l1 4.5a2.5 2.5 0 0 1-4.2 2.3l-2-1.9H8.6l-2 1.9a2.5 2.5 0 0 1-4.2-2.3l1-4.5A4 4 0 0 1 7.3 8Z" {...line} />
    <path d="M7.2 11v4m-2-2h4" {...gold} />
    <circle cx="16.2" cy="12" r=".9" fill="#FFBE0D" />
    <circle cx="18.2" cy="14" r=".9" fill="currentColor" />
  </IconFrame>
);

export const SetupIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <rect x="3" y="4.5" width="18" height="11" rx="2" {...line} />
    <path d="M8.5 20h7M12 15.5V20" {...line} />
    <path d="M7 8.5h6M7 11.5h3" {...gold} />
  </IconFrame>
);

export const VisitsIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12Z" {...line} />
    <circle cx="12" cy="12" r="3" {...line} />
    <path d="M12 9a3 3 0 0 1 3 3" {...gold} />
  </IconFrame>
);

export const AudienceIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <circle cx="9" cy="8" r="3.1" {...line} />
    <path d="M3.4 19.5v-1.2A4.8 4.8 0 0 1 8.2 13.5h1.6a4.8 4.8 0 0 1 4.8 4.8v1.2Z" {...line} />
    <path d="M15.6 5.2a3.1 3.1 0 0 1 0 5.9M17 13.6a4.8 4.8 0 0 1 3.7 4.7v1.2h-3.1" {...gold} />
  </IconFrame>
);
