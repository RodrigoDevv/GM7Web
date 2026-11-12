import React, { useState } from 'react';
import { Check, Gamepad2, LayoutGrid, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { GameItem } from '../../data/games';
import { AdminButton, CloseButton, EmptyHint, Field, ImageField, TextArea, TextInput } from './fields';

interface GameEditorProps {
  items: GameItem[];
  onCommit: (next: GameItem[]) => Promise<boolean>;
  saving: boolean;
  onToast?: (msg: string) => void;
}

function blankGame(): GameItem {
  return {
    id: `game-${Date.now().toString(36)}`,
    title: '',
    genre: '',
    category: '',
    tag: '',
    image: '',
    scheduleDay: '',
    initialHypes: 0,
    rankBadge: '',
    loadout: '',
    squadStatus: '',
    description: '',
    youtubeUrl: '',
  };
}

export const GameEditor: React.FC<GameEditorProps> = ({ items, onCommit, saving, onToast }) => {
  const { isDark } = useTheme();
  const [draft, setDraft] = useState<GameItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [homePickerOpen, setHomePickerOpen] = useState(false);
  const [homeSelection, setHomeSelection] = useState<string[]>([]);

  const visibleHomeIds = new Set(
    items.filter((item) => item.showOnHome !== false).slice(0, 5).map((item) => item.id),
  );

  const openHomePicker = () => {
    setHomeSelection(items.filter((item) => item.showOnHome !== false).slice(0, 5).map((item) => item.id));
    setHomePickerOpen(true);
  };

  const toggleHomeGame = (id: string) => {
    setHomeSelection((previous) => {
      if (previous.includes(id)) return previous.filter((item) => item !== id);
      if (previous.length >= 5) {
        onToast?.('You can feature up to 5 game cards on the home page.');
        return previous;
      }
      return [...previous, id];
    });
  };

  const saveHomeSelection = async () => {
    const ok = await onCommit(
      items.map((item) => ({ ...item, showOnHome: homeSelection.includes(item.id) })),
    );
    if (ok) setHomePickerOpen(false);
  };

  const startNew = () => {
    setEditingId(null);
    setDraft(blankGame());
  };

  const startEdit = (game: GameItem) => {
    setEditingId(game.id);
    setDraft({ ...game });
  };

  const update = <K extends keyof GameItem>(key: K, value: GameItem[K]) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.title.trim()) {
      onToast?.('Give the game a title first.');
      return;
    }
    const next = editingId
      ? items.map((item) => (item.id === editingId ? { ...draft, title: draft.title.trim() } : item))
      : [...items, { ...draft, title: draft.title.trim(), showOnHome: visibleHomeIds.size < 5 }];
    const ok = await onCommit(next);
    if (ok) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const remove = async (game: GameItem) => {
    if (!window.confirm(`Remove "${game.title}" from the rotation?`)) return;
    const ok = await onCommit(items.filter((item) => item.id !== game.id));
    if (ok && editingId === game.id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Gamepad2 className="h-5 w-5 text-[#FFBE0D]" />
            What We Play cards
          </h2>
          <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {items.length} game{items.length === 1 ? '' : 's'} in the rotation. Select which cards appear on the home page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton variant="ghost" onClick={openHomePicker} disabled={saving || items.length === 0}>
            <LayoutGrid className="h-4 w-4" />
            Choose home cards
          </AdminButton>
          <AdminButton onClick={startNew} disabled={saving}>
            <Plus className="h-4 w-4" />
            Add game
          </AdminButton>
        </div>
      </div>

      {draft && (
        <form onSubmit={submit} className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-[#FFBE0D]/30 bg-neutral-900/70' : 'border-orange-300 bg-orange-50/40'}`}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
              {editingId ? 'Edit game card' : 'New game card'}
            </p>
            <CloseButton onClick={() => { setDraft(null); setEditingId(null); }} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <TextInput value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Ghost of Tsushima" />
            </Field>
            <Field label="Type">
              <TextInput value={draft.genre} onChange={(event) => update('genre', event.target.value)} placeholder="e.g. Story Game" />
            </Field>
            <Field label="Category">
              <TextInput value={draft.category} onChange={(event) => update('category', event.target.value)} placeholder="e.g. RPG / FPS / Sports" />
            </Field>
            <Field label="Since">
              <TextInput value={draft.scheduleDay} onChange={(event) => update('scheduleDay', event.target.value)} placeholder="e.g. 2012" />
            </Field>
            <div className="sm:col-span-2">
              <ImageField value={draft.image} onChange={(value) => update('image', value)} />
            </div>
            <Field label="YouTube link" hint="Optional. Opens when someone clicks the YouTube button on this game card." className="sm:col-span-2">
              <TextInput
                value={draft.youtubeUrl ?? ''}
                onChange={(event) => update('youtubeUrl', event.target.value)}
                placeholder="https://youtube.com/watch?v=… or a channel/playlist link"
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <TextArea value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="Short description shown in the game detail modal." />
            </Field>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <AdminButton type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add game'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setDraft(null); setEditingId(null); }}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyHint title="No game cards yet" hint="Add your first game to populate the What We Play section." />
      ) : (
        <div className="space-y-2.5">
          {items.map((game) => (
            <div
              key={game.id}
              className={`flex items-center gap-3 rounded-2xl border p-2.5 sm:gap-4 sm:p-3 ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}
            >
              <div className={`h-16 w-12 shrink-0 overflow-hidden rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-100'}`}>
                {game.image ? (
                  <img src={game.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-500"><Gamepad2 className="h-5 w-5" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold">{game.title || 'Untitled game'}</p>
                  {visibleHomeIds.has(game.id) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFBE0D]/15 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
                      <Check className="h-3 w-3" /> On home
                    </span>
                  )}
                </div>
                <p className={`truncate text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {[game.genre, game.category, game.scheduleDay].filter(Boolean).join(' · ') || 'No details yet'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <AdminButton variant="ghost" onClick={() => startEdit(game)} disabled={saving} className="!px-3">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(game)} disabled={saving} className="!px-3">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {homePickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setHomePickerOpen(false)}
        >
          <div
            className={`flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${isDark ? 'border-white/10 bg-neutral-950 text-white' : 'border-neutral-200 bg-white text-neutral-900'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`flex items-start justify-between gap-3 border-b p-4 sm:p-5 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div>
                <h3 className="text-base font-black tracking-tight">Choose home cards</h3>
                <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Select up to 5 games to show in the What We Play section on the home page.
                </p>
              </div>
              <CloseButton onClick={() => setHomePickerOpen(false)} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
              {items.length === 0 ? (
                <EmptyHint title="No game cards yet" hint="Add games first, then choose which ones appear on the home page." />
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {items.map((game) => {
                    const selected = homeSelection.includes(game.id);
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => toggleHomeGame(game.id)}
                        aria-pressed={selected}
                        className={`group relative overflow-hidden rounded-xl border text-left transition-all ${selected ? 'border-[#FFBE0D] ring-2 ring-[#FFBE0D]/30' : isDark ? 'border-neutral-800 hover:border-neutral-600' : 'border-neutral-200 hover:border-neutral-300'}`}
                      >
                        <div className={`relative aspect-[3/4] w-full overflow-hidden ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
                          {game.image ? (
                            <img src={game.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-500"><Gamepad2 className="h-6 w-6" /></div>
                          )}
                          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 ${selected ? '' : 'opacity-90'}`}>
                            <p className="truncate text-[11px] font-bold text-white">{game.title || 'Untitled game'}</p>
                            <p className="truncate text-[10px] text-neutral-300">{game.genre || 'Game'}</p>
                          </div>
                          <span className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border ${selected ? 'border-[#FFBE0D] bg-[#FFBE0D] text-black' : 'border-white/40 bg-black/50 text-transparent'}`}>
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`flex flex-wrap items-center justify-between gap-3 border-t p-4 sm:p-5 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className={`text-xs font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {homeSelection.length} / 5 selected
              </span>
              <div className="flex items-center gap-2">
                <AdminButton variant="ghost" onClick={() => setHomePickerOpen(false)}>Cancel</AdminButton>
                <AdminButton onClick={saveHomeSelection} disabled={saving}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : 'Save selection'}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
