import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { HeroSlide } from '../../data/hero';
import { proxiedImageUrl } from '../../lib/media';
import { AdminButton, CloseButton, EmptyHint, Field, ImageField, TextInput } from './fields';

interface HeroEditorProps {
  items: HeroSlide[];
  onCommit: (next: HeroSlide[]) => Promise<boolean>;
  saving: boolean;
  onToast?: (msg: string) => void;
}

function blankSlide(index: number): HeroSlide {
  return {
    id: `hero-${Date.now().toString(36)}`,
    src: '',
    alt: `Hero image ${index + 1}`,
  };
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ items, onCommit, saving, onToast }) => {
  const { isDark } = useTheme();
  const [draft, setDraft] = useState<HeroSlide | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startNew = () => {
    setEditingId(null);
    setDraft(blankSlide(items.length));
  };

  const startEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setDraft({ ...slide });
  };

  const update = <K extends keyof HeroSlide>(key: K, value: HeroSlide[K]) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.src.trim()) {
      onToast?.('Add an image URL or upload a file first.');
      return;
    }
    const next = editingId
      ? items.map((item) => (item.id === editingId ? { ...draft, src: draft.src.trim() } : item))
      : [...items, { ...draft, src: draft.src.trim() }];
    const ok = await onCommit(next);
    if (ok) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const remove = async (slide: HeroSlide, index: number) => {
    if (items.length <= 1) {
      onToast?.('Keep at least one hero image so the slideshow has something to show.');
      return;
    }
    if (!window.confirm(`Remove hero image ${index + 1}?`)) return;
    const ok = await onCommit(items.filter((item) => item.id !== slide.id));
    if (ok && editingId === slide.id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    await onCommit(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <ImagePlus className="h-5 w-5 text-[#FFBE0D]" />
            Hero slideshow images
          </h2>
          <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {items.length} image{items.length === 1 ? '' : 's'} rotating behind the hero text. Add, edit, remove, or reorder them.
          </p>
        </div>
        <AdminButton onClick={startNew} disabled={saving}>
          <Plus className="h-4 w-4" />
          Add image
        </AdminButton>
      </div>

      {draft && (
        <form onSubmit={submit} className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-[#FFBE0D]/30 bg-neutral-900/70' : 'border-orange-300 bg-orange-50/40'}`}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
              {editingId ? 'Edit hero image' : 'New hero image'}
            </p>
            <CloseButton onClick={() => { setDraft(null); setEditingId(null); }} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageField
                value={draft.src}
                onChange={(value) => update('src', value)}
                label="Hero image"
                hint="Paste an image URL or upload a file. A wide landscape image works best."
              />
            </div>
            <Field label="Alt text" hint="Describes the image for screen readers." className="sm:col-span-2">
              <TextInput
                value={draft.alt}
                onChange={(event) => update('alt', event.target.value)}
                placeholder="e.g. GM7 community event stage"
              />
            </Field>
          </div>

          {draft.src && (
            <div className={`mt-4 overflow-hidden rounded-xl border ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
              <img src={proxiedImageUrl(draft.src)} alt="" className="h-40 w-full object-cover" />
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            <AdminButton type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add image'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setDraft(null); setEditingId(null); }}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyHint title="No hero images yet" hint="Add your first image to populate the hero slideshow." />
      ) : (
        <div className="space-y-2.5">
          {items.map((slide, index) => (
            <div
              key={slide.id}
              className={`flex items-center gap-3 rounded-2xl border p-2.5 sm:gap-4 sm:p-3 ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}
            >
              <span className={`w-5 shrink-0 text-center text-[11px] font-mono font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {index + 1}
              </span>
              <div className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-100'}`}>
                {slide.src ? (
                  <img src={proxiedImageUrl(slide.src)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-500"><ImagePlus className="h-5 w-5" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{slide.alt || `Hero image ${index + 1}`}</p>
                <p className={`truncate text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {slide.src.startsWith('data:') ? 'Uploaded image' : slide.src || 'No image set'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <AdminButton variant="ghost" onClick={() => move(index, -1)} disabled={saving || index === 0} className="!px-2.5" >
                  <ArrowUp className="h-3.5 w-3.5" />
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => move(index, 1)} disabled={saving || index === items.length - 1} className="!px-2.5">
                  <ArrowDown className="h-3.5 w-3.5" />
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => startEdit(slide)} disabled={saving} className="!px-3">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(slide, index)} disabled={saving} className="!px-3">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
