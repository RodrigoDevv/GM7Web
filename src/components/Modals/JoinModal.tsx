import React, { useState } from 'react';
import { X, Check, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { CommunityGroup } from '../../types/community';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  communities: CommunityGroup[];
  onCompleteJoin: (data: { name: string; handle: string; role: string; selectedGroups: string[] }) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  communities,
  onCompleteJoin,
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('Frontend Engineer');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['grp-1', 'grp-2']);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCompleteJoin({
      name,
      handle: handle.startsWith('@') ? handle : `@${handle || name.toLowerCase().replace(/\s+/g, '_')}`,
      role,
      selectedGroups,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFBE0D] text-neutral-900 mx-auto flex items-center justify-center shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">
              Welcome to GM7!
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Your profile is active and your joined guilds are synced.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#386BFF] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join 48,000+ Builders</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">
                Create Your Community Pass
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Participate in discussions, showcase projects, and RSVP for live workshops.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#386BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Username / Handle
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@jordan_codes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#386BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Primary Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. UI/UX Designer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#386BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Guilds to Follow
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {communities.map((c) => {
                    const isSelected = selectedGroups.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleGroup(c.id)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#386BFF]/10 border-[#386BFF] text-[#386BFF] dark:text-blue-400'
                            : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#386BFF] hover:bg-[#2c54d1] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-neutral-400 mt-2">
                100% free · You can adjust your notification settings anytime.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
