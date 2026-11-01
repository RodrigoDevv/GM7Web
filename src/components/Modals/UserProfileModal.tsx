import React, { useState } from 'react';
import { X, Check, Bookmark, Calendar, Compass, Edit3, User, Sparkles } from 'lucide-react';
import { UserProfile, CommunityGroup, CommunityEvent } from '../../types/community';

interface UserProfileModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  communities: CommunityGroup[];
  events: CommunityEvent[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  communities,
  events,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [bio, setBio] = useState(currentUser.bio);

  if (!isOpen) return null;

  const joinedCommunities = communities.filter((c) =>
    currentUser.joinedGroups.includes(c.id)
  );
  const userEvents = events.filter((e) =>
    currentUser.registeredEvents.includes(e.id)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, role, bio });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white dark:bg-neutral-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:text-neutral-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-start gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#386BFF]/30 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-neutral-900 dark:text-white">
                {currentUser.name}
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-[#386BFF] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
            <p className="text-xs text-neutral-400 mb-1">{currentUser.handle}</p>
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {currentUser.role}
            </p>
          </div>
        </div>

        {/* Editing Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#386BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Role & Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#386BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#386BFF]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#386BFF] hover:bg-[#2c54d1] text-white font-semibold text-xs transition-colors"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {currentUser.bio}
          </p>
        )}

        {/* Member Status Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
          <div>
            <div className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
              {currentUser.joinedGroups.length}
            </div>
            <div className="text-[11px] text-neutral-400">Guilds</div>
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
              {currentUser.registeredEvents.length}
            </div>
            <div className="text-[11px] text-neutral-400">Events RSVP</div>
          </div>
          <div>
            <div className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
              {currentUser.followingMembers.length}
            </div>
            <div className="text-[11px] text-neutral-400">Following</div>
          </div>
        </div>

        {/* Joined Communities List */}
        <div>
          <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#386BFF]" />
            <span>Joined Communities</span>
          </h4>
          <div className="space-y-1.5">
            {joinedCommunities.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-neutral-900 dark:text-white">{c.name}</span>
                <span className="text-neutral-400 text-[11px]">{c.memberCount.toLocaleString()} members</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Events */}
        {userEvents.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Upcoming RSVPs</span>
            </h4>
            <div className="space-y-1.5">
              {userEvents.map((e) => (
                <div
                  key={e.id}
                  className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-xs">{e.title}</span>
                  <span className="text-[#386BFF] text-[11px] font-medium shrink-0">{e.displayDate.month} {e.displayDate.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
