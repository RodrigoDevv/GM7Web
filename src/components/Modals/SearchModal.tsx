import React, { useState, useEffect } from 'react';
import { Search, X, Compass, MessageSquare, Calendar, User, Layers, ArrowRight } from 'lucide-react';
import {
  CommunityGroup,
  Discussion,
  CommunityEvent,
  SpotlightMember,
  ShowcaseProject
} from '../../types/community';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  communities: CommunityGroup[];
  discussions: Discussion[];
  events: CommunityEvent[];
  members: SpotlightMember[];
  projects: ShowcaseProject[];
  onSelectDiscussion: (d: Discussion) => void;
  onSelectMember: (m: SpotlightMember) => void;
  onSelectProject: (p: ShowcaseProject) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  communities,
  discussions,
  events,
  members,
  projects,
  onSelectDiscussion,
  onSelectMember,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingCommunities = q
    ? communities.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : communities.slice(0, 3);

  const matchingDiscussions = q
    ? discussions.filter((d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
    : discussions.slice(0, 3);

  const matchingEvents = q
    ? events.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
    : events.slice(0, 2);

  const matchingMembers = q
    ? members.filter((m) => m.name.toLowerCase().includes(q) || m.handle.toLowerCase().includes(q))
    : members.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities, discussions, events, members..."
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Discussions Section */}
          {matchingDiscussions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#386BFF]" />
                <span>Discussions</span>
              </div>
              <div className="space-y-1.5">
                {matchingDiscussions.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectDiscussion(d);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="truncate">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {d.title}
                      </p>
                      <p className="text-neutral-400 text-[11px] truncate">
                        {d.author.name} · {d.groupName}
                      </p>
                    </div>
                    <span className="text-neutral-400 tabular-nums shrink-0">
                      {d.likesCount} upvotes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities Section */}
          {matchingCommunities.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Communities</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingCommunities.map((c) => (
                  <a
                    key={c.id}
                    href="#communities"
                    onClick={onClose}
                    className="p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-xs flex items-center justify-between"
                  >
                    <div className="truncate">
                      <span className="font-semibold text-neutral-900 dark:text-white truncate">
                        {c.name}
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        {c.memberCount.toLocaleString()} members
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {matchingMembers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FFBE0D]" />
                <span>Members</span>
              </div>
              <div className="space-y-1.5">
                {matchingMembers.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMember(m);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors flex items-center gap-3 text-xs"
                  >
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {m.name} <span className="text-neutral-400 font-normal">{m.handle}</span>
                      </p>
                      <p className="text-neutral-400 text-[11px] truncate">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
