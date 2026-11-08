import React, { useState } from 'react';
import { CalendarDays, Pencil, Plus, Save, Star, Trash2, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { AvailableTournament, RegistrationStatus } from '../../data/tournaments';
import { AdminButton, CloseButton, EmptyHint, Field, ImageField, SelectInput, TextArea, TextInput } from './fields';

interface TournamentEditorProps {
  items: AvailableTournament[];
  onCommit: (next: AvailableTournament[]) => Promise<boolean>;
  saving: boolean;
  onToast?: (msg: string) => void;
}

const STATUSES: RegistrationStatus[] = ['Registration Open', 'Closing Soon', 'Waitlist'];

function blankTournament(): AvailableTournament {
  return {
    id: `tournament-${Date.now().toString(36)}`,
    name: '',
    game: '',
    format: '',
    dateLabel: '',
    startIso: '',
    prizePool: 'Free',
    entry: 'Free entry',
    filledSlots: 0,
    maxSlots: 32,
    status: 'Registration Open',
    platform: '',
    description: '',
    image: '',
    featured: false,
  };
}

function toLocalInput(iso: string) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

export const TournamentEditor: React.FC<TournamentEditorProps> = ({ items, onCommit, saving, onToast }) => {
  const { isDark } = useTheme();
  const [draft, setDraft] = useState<AvailableTournament | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startNew = () => {
    setEditingId(null);
    setDraft(blankTournament());
  };

  const startEdit = (tournament: AvailableTournament) => {
    setEditingId(tournament.id);
    setDraft({ ...tournament });
  };

  const update = <K extends keyof AvailableTournament>(key: K, value: AvailableTournament[K]) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.name.trim()) {
      onToast?.('Give the tournament a name first.');
      return;
    }
    const normalized: AvailableTournament = {
      ...draft,
      name: draft.name.trim(),
      maxSlots: Math.max(1, draft.maxSlots),
      filledSlots: Math.max(0, Math.min(draft.filledSlots, Math.max(1, draft.maxSlots))),
    };
    const merged = editingId
      ? items.map((item) => (item.id === editingId ? normalized : item))
      : [...items, normalized];
    const next = normalized.featured
      ? merged.map((item) => ({ ...item, featured: item.id === normalized.id }))
      : merged;
    const ok = await onCommit(next);
    if (ok) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const remove = async (tournament: AvailableTournament) => {
    if (!window.confirm(`Delete "${tournament.name}"?`)) return;
    const ok = await onCommit(items.filter((item) => item.id !== tournament.id));
    if (ok && editingId === tournament.id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Trophy className="h-5 w-5 text-[#FFBE0D]" />
            Tournaments
          </h2>
          <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {items.length} open event{items.length === 1 ? '' : 's'}. The featured event becomes the big hero at the top of the tournaments page.
          </p>
        </div>
        <AdminButton onClick={startNew} disabled={saving}>
          <Plus className="h-4 w-4" />
          Add tournament
        </AdminButton>
      </div>

      {draft && (
        <form onSubmit={submit} className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-[#FFBE0D]/30 bg-neutral-900/70' : 'border-orange-300 bg-orange-50/40'}`}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
              {editingId ? 'Edit tournament' : 'New tournament'}
            </p>
            <CloseButton onClick={() => { setDraft(null); setEditingId(null); }} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tournament name" required className="sm:col-span-2">
              <TextInput value={draft.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. GM7 Dojo Cup #8" />
            </Field>
            <Field label="Game">
              <TextInput value={draft.game} onChange={(event) => update('game', event.target.value)} placeholder="e.g. Apex Legends" />
            </Field>
            <Field label="Format">
              <TextInput value={draft.format} onChange={(event) => update('format', event.target.value)} placeholder="e.g. 3v3 · Double Elimination · Bo3" />
            </Field>
            <Field label="Date label" hint="Shown on cards, e.g. Sat, Nov 7 · 18:00 UTC">
              <TextInput value={draft.dateLabel} onChange={(event) => update('dateLabel', event.target.value)} placeholder="Sat, Nov 7 · 18:00 UTC" />
            </Field>
            <Field label="Start date & time" hint="Powers the countdown timer">
              <TextInput
                type="datetime-local"
                value={toLocalInput(draft.startIso)}
                onChange={(event) => update('startIso', fromLocalInput(event.target.value))}
              />
            </Field>
            <Field label="Prize pool">
              <TextInput value={draft.prizePool} onChange={(event) => update('prizePool', event.target.value)} placeholder="$2,000" />
            </Field>
            <Field label="Entry">
              <TextInput value={draft.entry} onChange={(event) => update('entry', event.target.value)} placeholder="Free entry" />
            </Field>
            <Field label="Filled slots">
              <TextInput type="number" min={0} value={draft.filledSlots} onChange={(event) => update('filledSlots', Number(event.target.value) || 0)} />
            </Field>
            <Field label="Max slots">
              <TextInput type="number" min={1} value={draft.maxSlots} onChange={(event) => update('maxSlots', Number(event.target.value) || 1)} />
            </Field>
            <Field label="Registration status">
              <SelectInput value={draft.status} onChange={(event) => update('status', event.target.value as RegistrationStatus)}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Platform">
              <TextInput value={draft.platform} onChange={(event) => update('platform', event.target.value)} placeholder="PC / Console crossplay" />
            </Field>
            <div className="sm:col-span-2">
              <ImageField value={draft.image} onChange={(value) => update('image', value)} />
            </div>
            <Field label="Description" className="sm:col-span-2">
              <TextArea value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="What players can expect from this cup." />
            </Field>
            <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold sm:col-span-2 ${draft.featured ? 'border-[#FFBE0D] bg-[#FFBE0D]/10' : isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-white'}`}>
              <input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => update('featured', event.target.checked)} className="h-4 w-4 accent-[#FFBE0D]" />
              <Star className={`h-4 w-4 ${draft.featured ? 'text-[#FFBE0D]' : 'text-neutral-500'}`} />
              Feature this tournament in the announcement hero
            </label>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <AdminButton type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add tournament'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setDraft(null); setEditingId(null); }}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyHint title="No tournaments yet" hint="Add an event and it will show up on the Tournaments page immediately." />
      ) : (
        <div className={`divide-y rounded-lg border ${isDark ? 'divide-white/10 border-white/10' : 'divide-black/10 border-black/10'}`}>
          {items.map((tournament) => {
            const progress = Math.round((tournament.filledSlots / Math.max(1, tournament.maxSlots)) * 100);
            const statusTone = tournament.status === 'Registration Open' ? 'text-emerald-500' : tournament.status === 'Closing Soon' ? 'text-amber-500' : 'text-neutral-500';
            return (
              <div
                key={tournament.id}
                className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4"
              >
                <div className={`h-14 w-20 shrink-0 overflow-hidden rounded border ${isDark ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-neutral-100'}`}>
                  {tournament.image ? (
                    <img src={tournament.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-500"><Trophy className="h-5 w-5" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">{tournament.name || 'Untitled tournament'}</p>
                    {tournament.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#b88a00] dark:text-[#FFBE0D]">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                    <span className={`text-[10px] font-medium ${statusTone}`}>· {tournament.status}</span>
                  </div>
                  <p className={`mt-0.5 flex flex-wrap items-center gap-x-2 truncate text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    <span>{tournament.game || 'Game'}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{tournament.dateLabel || 'No date'}</span>
                    <span>·</span>
                    <span>{tournament.filledSlots}/{tournament.maxSlots} registered</span>
                  </p>
                  <div className={`mt-2 h-1 max-w-56 overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`} aria-label={`${progress}% of tournament places filled`}><div className="h-full bg-[#FFBE0D]" style={{ width: `${Math.min(100, progress)}%` }} /></div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <AdminButton variant="ghost" onClick={() => startEdit(tournament)} disabled={saving} className="!px-3">
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => remove(tournament)} disabled={saving} className="!px-3">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </AdminButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
