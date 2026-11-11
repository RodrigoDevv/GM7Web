import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Monitor, Move, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SETUP_ICON_OPTIONS, getSetupIcon, type SetupContent, type SetupItem } from '../../data/setup';
import { proxiedImageUrl } from '../../lib/media';
import { AdminButton, CloseButton, EmptyHint, Field, ImageField, TextInput } from './fields';

interface SetupEditorProps {
  setup: SetupContent;
  onCommit: (next: SetupContent) => Promise<boolean>;
  saving: boolean;
  onToast?: (msg: string) => void;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const round = (value: number) => Math.round(value * 10) / 10;

function blankItem(hotspot = { x: 50, y: 50 }): SetupItem {
  return {
    id: `setup-${Date.now().toString(36)}`,
    name: '',
    category: '',
    spec: '',
    icon: 'box',
    image: '',
    hotspot,
  };
}

export const SetupEditor: React.FC<SetupEditorProps> = ({ setup, onCommit, saving, onToast }) => {
  const { isDark } = useTheme();
  const [background, setBackground] = useState(setup.backgroundImage);
  const [items, setItems] = useState<SetupItem[]>(setup.items);
  const [draft, setDraft] = useState<SetupItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragItemsRef = useRef<SetupItem[] | null>(null);

  useEffect(() => {
    setBackground(setup.backgroundImage);
  }, [setup.backgroundImage]);

  useEffect(() => {
    setItems(setup.items);
  }, [setup.items]);

  const persist = (nextItems: SetupItem[], nextBackground = background) =>
    onCommit({ backgroundImage: nextBackground, items: nextItems });

  const saveBackground = async () => {
    await persist(items, background);
  };

  const startNew = () => {
    setEditingId(null);
    setDraft(blankItem());
  };

  const startEdit = (item: SetupItem) => {
    setEditingId(item.id);
    setDraft({ ...item, hotspot: { ...item.hotspot } });
  };

  const update = <K extends keyof SetupItem>(key: K, value: SetupItem[K]) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const updateHotspot = (axis: 'x' | 'y', value: number) => {
    setDraft((previous) =>
      previous ? { ...previous, hotspot: { ...previous.hotspot, [axis]: clamp(value) } } : previous,
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.name.trim()) {
      onToast?.('Give the item a name first.');
      return;
    }
    const normalized: SetupItem = {
      ...draft,
      name: draft.name.trim(),
      hotspot: { x: clamp(draft.hotspot.x), y: clamp(draft.hotspot.y) },
    };
    const nextItems = editingId
      ? items.map((item) => (item.id === editingId ? normalized : item))
      : [...items, normalized];
    const ok = await persist(nextItems);
    if (ok) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const remove = async (item: SetupItem) => {
    if (!window.confirm(`Remove "${item.name || 'this item'}" from the setup?`)) return;
    const ok = await persist(items.filter((entry) => entry.id !== item.id));
    if (ok && editingId === item.id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, item: SetupItem) => {
    event.preventDefault();
    dragItemsRef.current = items;
    setDraggingId(item.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!draggingId || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = round(clamp(((event.clientX - rect.left) / rect.width) * 100));
    const y = round(clamp(((event.clientY - rect.top) / rect.height) * 100));
    const next = (dragItemsRef.current ?? items).map((item) =>
      item.id === draggingId ? { ...item, hotspot: { x, y } } : item,
    );
    dragItemsRef.current = next;
    setItems(next);
  };

  const handlePointerUp = async (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const next = dragItemsRef.current ?? items;
    setDraggingId(null);
    dragItemsRef.current = null;
    await persist(next);
  };

  const previewSrc = proxiedImageUrl(background) || setup.backgroundImage;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Monitor className="h-5 w-5 text-[#FFBE0D]" />
            Battle station setup
          </h2>
          <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {items.length} item{items.length === 1 ? '' : 's'} on the setup. Drag a marker to move it, or add a new one.
          </p>
        </div>
        <AdminButton onClick={startNew} disabled={saving}>
          <Plus className="h-4 w-4" />
          Add item
        </AdminButton>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className={`rounded-2xl border p-4 sm:p-5 ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}>
          <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">Setup picture</p>
          <p className={`mt-1 mb-4 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Upload or link the full photo that sits behind the interactive markers.
          </p>
          <ImageField
            label="Background image"
            hint="Paste an image URL or upload a file."
            value={background}
            onChange={setBackground}
          />
          <div className="mt-4 flex items-center gap-2">
            <AdminButton onClick={saveBackground} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save picture'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => setBackground(setup.backgroundImage)} disabled={saving}>
              Reset
            </AdminButton>
          </div>
        </div>

        <div className={`rounded-2xl border p-4 sm:p-5 ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">Preview</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              <Move className="h-3 w-3" /> Drag markers
            </span>
          </div>
          <div
            ref={previewRef}
            className={`relative aspect-[16/9] w-full touch-none select-none overflow-hidden rounded-xl border ${isDark ? 'border-neutral-700 bg-neutral-950' : 'border-neutral-200 bg-neutral-100'}`}
          >
            {previewSrc ? (
              <img src={previewSrc} alt="" className="h-full w-full object-cover" draggable={false} />
            ) : (
              <div className={`flex h-full w-full items-center justify-center text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Add a setup picture to preview it
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            {items.map((item) => {
              const Icon = getSetupIcon(item.icon);
              const active = draggingId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onPointerDown={(event) => handlePointerDown(event, item)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  title={`${item.name || 'Item'} — drag to move`}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                  style={{ left: `${item.hotspot.x}%`, top: `${item.hotspot.y}%` }}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-lg transition-transform ${active
                      ? 'scale-125 border-white bg-[#FFBE0D] text-black'
                      : 'border-white/80 bg-black/80 text-white hover:bg-[#FFBE0D] hover:text-black'}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
            {items.length === 0 && previewSrc && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white`}>
                  <Crosshair className="h-3.5 w-3.5 text-[#FFBE0D]" /> No markers yet — add an item
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {draft && (
        <form onSubmit={submit} className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-[#FFBE0D]/30 bg-neutral-900/70' : 'border-orange-300 bg-orange-50/40'}`}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
              {editingId ? 'Edit setup item' : 'New setup item'}
            </p>
            <CloseButton onClick={() => { setDraft(null); setEditingId(null); }} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <TextInput value={draft.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Gaming PC" />
            </Field>
            <Field label="Category">
              <TextInput value={draft.category} onChange={(event) => update('category', event.target.value)} placeholder="e.g. PC / Monitor / Mouse" />
            </Field>
            <Field label="Spec" hint="Small line under the name in the tooltip." className="sm:col-span-2">
              <TextInput value={draft.spec} onChange={(event) => update('spec', event.target.value)} placeholder="e.g. RTX 5090 · 64GB RAM" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Icon">
                <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                  {SETUP_ICON_OPTIONS.map(({ key, label, Icon }) => {
                    const selected = draft.icon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        title={label}
                        aria-label={label}
                        aria-pressed={selected}
                        onClick={() => update('icon', key)}
                        className={`flex h-10 items-center justify-center rounded-lg border transition-colors ${selected
                          ? 'border-[#FFBE0D] bg-[#FFBE0D] text-black'
                          : isDark
                            ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-[#FFBE0D]/60'
                            : 'border-neutral-300 bg-white text-neutral-600 hover:border-orange-400'}`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <ImageField label="Item image" hint="Optional. Shown inside the hover tooltip." value={draft.image} onChange={(value) => update('image', value)} />
            </div>
            <Field label="Horizontal position (%)">
              <TextInput type="number" min={0} max={100} step={0.1} value={draft.hotspot.x} onChange={(event) => updateHotspot('x', Number(event.target.value) || 0)} />
            </Field>
            <Field label="Vertical position (%)">
              <TextInput type="number" min={0} max={100} step={0.1} value={draft.hotspot.y} onChange={(event) => updateHotspot('y', Number(event.target.value) || 0)} />
            </Field>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <AdminButton type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add item'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setDraft(null); setEditingId(null); }}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyHint title="No setup items yet" hint="Add your first piece of gear to put a marker on the setup picture." />
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => {
            const Icon = getSetupIcon(item.icon);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl border p-2.5 sm:gap-4 sm:p-3 ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800 text-[#FFBE0D]' : 'border-neutral-200 bg-neutral-100 text-orange-700'}`}>
                  {item.image ? (
                    <img src={proxiedImageUrl(item.image)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{item.name || 'Untitled item'}</p>
                  <p className={`truncate text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {[item.category, item.spec, `${item.hotspot.x}%, ${item.hotspot.y}%`].filter(Boolean).join(' · ') || 'No details yet'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <AdminButton variant="ghost" onClick={() => startEdit(item)} disabled={saving} className="!px-3">
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => remove(item)} disabled={saving} className="!px-3">
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
