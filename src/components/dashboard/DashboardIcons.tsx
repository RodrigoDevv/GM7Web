import React from 'react';

type DashboardIconProps = { className?: string };

const IconFrame: React.FC<DashboardIconProps & { children: React.ReactNode }> = ({ className = 'h-5 w-5', children }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const outline = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const OverviewIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M3.5 10.2 12 3.8l8.5 6.4v9.1a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2z" {...outline} />
    <path d="M8 16v-2.5m4 2.5v-5m4 5v-3.5" {...outline} />
    <path d="M3.5 10.2 12 3.8l8.5 6.4" stroke="#FFBE0D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </IconFrame>
);

export const TournamentIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M8 4h8v4.2a4 4 0 0 1-8 0z" {...outline} />
    <path d="M8 6H4.5v1.2a4 4 0 0 0 4 4M16 6h3.5v1.2a4 4 0 0 1-4 4M12 12.2V17m-3.2 3h6.4M9.5 17h5l1 3h-7z" {...outline} />
    <path d="M10 7.1 12 6l2 1.1-.4 2.3-1.6 1-1.6-1z" fill="#FFBE0D" />
  </IconFrame>
);

export const GamesIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M7.3 8h9.4a4 4 0 0 1 3.9 3.1l1 4.5a2.5 2.5 0 0 1-4.2 2.3l-2-1.9H8.6l-2 1.9a2.5 2.5 0 0 1-4.2-2.3l1-4.5A4 4 0 0 1 7.3 8Z" {...outline} />
    <path d="M7.2 11v4m-2-2h4" stroke="#FFBE0D" strokeWidth="1.9" strokeLinecap="round" />
    <circle cx="16.2" cy="12" r=".8" fill="#FFBE0D" /><circle cx="18.2" cy="14" r=".8" fill="currentColor" />
  </IconFrame>
);

export const VisitsIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <path d="M2.8 12s3.2-5.5 9.2-5.5 9.2 5.5 9.2 5.5-3.2 5.5-9.2 5.5S2.8 12 2.8 12Z" {...outline} />
    <circle cx="12" cy="12" r="2.7" {...outline} />
    <path d="M12 9.3a2.7 2.7 0 0 1 2.7 2.7" stroke="#FFBE0D" strokeWidth="1.9" strokeLinecap="round" />
  </IconFrame>
);

export const AudienceIcon: React.FC<DashboardIconProps> = (props) => (
  <IconFrame {...props}>
    <circle cx="9" cy="8" r="3" {...outline} />
    <path d="M3.5 19v-1.3A4.7 4.7 0 0 1 8.2 13h1.6a4.7 4.7 0 0 1 4.7 4.7V19z" {...outline} />
    <path d="M15.5 5.3a3 3 0 0 1 0 5.7m1.2 2.2a4.7 4.7 0 0 1 3.8 4.6V19h-3" stroke="#FFBE0D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </IconFrame>
);
