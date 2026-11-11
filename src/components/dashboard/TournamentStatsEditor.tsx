import React, { useEffect, useState } from 'react';
import { Save, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { TournamentSeasonStats } from '../../data/tournaments';
import { AdminButton, Field, TextInput } from './fields';

interface TournamentStatsEditorProps {
  stats: TournamentSeasonStats;
  onCommit: (next: TournamentSeasonStats) => Promise<boolean>;
  saving: boolean;
  onToast?: (msg: string) => void;
}

const STAT_FIELDS: Array<{ key: keyof TournamentSeasonStats; label: string; hint: string; placeholder: string }> = [
  { key: 'hosted', label: 'Tournaments hosted', hint: 'Big number on the first stats card', placeholder: '24' },
  { key: 'prizePool', label: 'Prize pool awarded', hint: 'Total paid out to the community', placeholder: '$18,400' },
  { key: 'players', label: 'Players competed', hint: 'Unique bracket entrants', placeholder: '1,286' },
  { key: 'champions', label: 'Champions crowned', hint: 'Winners this season', placeholder: '24' },
];

export const TournamentStatsEditor: React.FC<TournamentStatsEditorProps> = ({ stats, onCommit, saving, onToast }) => {
  const { isDark } = useTheme();
  const [draft, setDraft] = useState<TournamentSeasonStats>(stats);

  useEffect(() => {
    setDraft(stats);
  }, [stats]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized: TournamentSeasonStats = {
      hosted: draft.hosted.trim(),
      prizePool: draft.prizePool.trim(),
      players: draft.players.trim(),
      champions: draft.champions.trim(),
    };
    if (!normalized.hosted || !normalized.prizePool || !normalized.players || !normalized.champions) {
      onToast?.('Fill in all four tournament stats first.');
      return;
    }
    await onCommit(normalized);
  };

  return (
    <form onSubmit={submit} className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-white/[0.09] bg-[#111]' : 'border-black/[0.08] bg-white'}`}>
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-[#FFBE0D]" />
        <div>
          <h2 className="text-lg font-black tracking-tight">Tournament Stats</h2>
          <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            The four big numbers shown on the tournaments page under “Season 2026 · By the numbers”.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {STAT_FIELDS.map((field) => (
          <Field key={field.key} label={field.label} hint={field.hint}>
            <TextInput
              value={draft[field.key]}
              onChange={(event) => setDraft((previous) => ({ ...previous, [field.key]: event.target.value }))}
              placeholder={field.placeholder}
            />
          </Field>
        ))}
      </div>

      <div className="mt-5">
        <AdminButton type="submit" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save stats'}
        </AdminButton>
      </div>
    </form>
  );
};
