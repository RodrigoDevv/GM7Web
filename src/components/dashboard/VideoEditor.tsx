import React, { useRef, useState } from 'react';
import { Film, Loader2, Pencil, Play, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { SocialPlatform, SocialVideo } from '../../data/socials';
import { proxiedImageUrl } from '../../lib/media';
import { AdminButton, CloseButton, EmptyHint, Field, ImageField, SelectInput, TextInput } from './fields';

interface VideoEditorProps {
  items: SocialVideo[];
  onCommit: (next: SocialVideo[]) => Promise<boolean>;
  saving: boolean;
  onToast?: (msg: string) => void;
}

interface LinkPreview {
  platform?: SocialPlatform;
  title?: string;
  thumb?: string;
  category?: string;
  duration?: string;
  views?: string;
  likes?: string;
  publishedAt?: string;
  url?: string;
}

function blankVideo(): SocialVideo {
  return {
    id: `video-${Date.now().toString(36)}`,
    platform: 'youtube',
    title: '',
    url: '',
    thumb: '',
    category: '',
    duration: '',
    views: '',
    likes: '',
    publishedAt: new Date().toISOString().slice(0, 10),
  };
}

function youtubeId(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    if (host === 'youtu.be') return url.pathname.match(/^\/([\w-]{6,})/)?.[1] ?? '';
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      return (
        url.searchParams.get('v')?.match(/^[\w-]{6,}$/)?.[0] ??
        url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{6,})/)?.[1] ??
        ''
      );
    }
  } catch {
    // Not a URL.
  }
  return '';
}

const DEFAULT_CATEGORY: Record<SocialPlatform, string> = {
  youtube: 'YouTube video',
  kick: 'Kick clip',
  tiktok: 'TikTok video',
  instagram: 'Instagram post',
};

const PLATFORM_BADGE: Record<SocialPlatform, string> = {
  youtube: 'bg-red-500/15 text-red-400',
  kick: 'bg-lime-500/15 text-lime-500',
  tiktok: 'bg-cyan-500/15 text-cyan-400',
  instagram: 'bg-pink-500/15 text-pink-400',
};

function toDateInput(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ items, onCommit, saving, onToast }) => {
  const { isDark } = useTheme();
  const [draft, setDraft] = useState<SocialVideo | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const previewedUrl = useRef('');

  const startNew = () => {
    setEditingId(null);
    setDraft(blankVideo());
  };

  const startEdit = (video: SocialVideo) => {
    setEditingId(video.id);
    setDraft({ ...video });
  };

  const update = <K extends keyof SocialVideo>(key: K, value: SocialVideo[K]) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const loadPreview = async (value?: string) => {
    const target = (value ?? draft?.url ?? '').trim();
    if (!draft || !target || previewing || previewedUrl.current === target) return;

    previewedUrl.current = target;
    setPreviewing(true);
    try {
      const response = await fetch(`/api/media/preview?url=${encodeURIComponent(target)}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = (await response.json().catch(() => ({}))) as LinkPreview & { error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not read that link.');

      const fill = (current: string | undefined, incoming: string | undefined) =>
        current && current.trim() ? current : incoming || current || '';

      setDraft((previous) => {
        if (!previous || previewedUrl.current !== target) return previous;
        return {
          ...previous,
          platform: data.platform ?? previous.platform,
          title: fill(previous.title, data.title),
          thumb: fill(previous.thumb, data.thumb),
          category: fill(previous.category, data.category),
          duration: fill(previous.duration, data.duration),
          views: fill(previous.views, data.views),
          likes: fill(previous.likes, data.likes),
          publishedAt: fill(previous.publishedAt, data.publishedAt),
          url: data.url || previous.url,
        };
      });
      onToast?.('Link details loaded.');
    } catch (error) {
      if (previewedUrl.current === target) previewedUrl.current = '';
      onToast?.(error instanceof Error ? error.message : 'Could not read that link.');
    } finally {
      setPreviewing(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.title.trim()) {
      onToast?.('Give the video a title first.');
      return;
    }
    let thumb = draft.thumb.trim();
    if (!thumb && draft.platform === 'youtube') {
      const id = youtubeId(draft.url);
      if (id) thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }
    const normalized: SocialVideo = {
      ...draft,
      title: draft.title.trim(),
      url: draft.url.trim(),
      thumb,
      category: draft.category.trim() || DEFAULT_CATEGORY[draft.platform],
    };
    const next = editingId
      ? items.map((item) => (item.id === editingId ? normalized : item))
      : [normalized, ...items];
    const ok = await onCommit(next);
    if (ok) {
      setDraft(null);
      setEditingId(null);
    }
  };

  const remove = async (video: SocialVideo) => {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    const ok = await onCommit(items.filter((item) => item.id !== video.id));
    if (ok && editingId === video.id) {
      setDraft(null);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <Film className="h-5 w-5 text-[#FFBE0D]" />
            Social videos
          </h2>
          <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {items.length} manual video{items.length === 1 ? '' : 's'} pinned to the Socials page, on top of the live YouTube/Kick/TikTok/Instagram feed.
          </p>
        </div>
        <AdminButton onClick={startNew} disabled={saving}>
          <Plus className="h-4 w-4" />
          Add video
        </AdminButton>
      </div>

      {draft && (
        <form onSubmit={submit} className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-[#FFBE0D]/30 bg-neutral-900/70' : 'border-orange-300 bg-orange-50/40'}`}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-wider text-[#8C6500] dark:text-[#FFBE0D]">
              {editingId ? 'Edit video' : 'New video'}
            </p>
            <CloseButton onClick={() => { setDraft(null); setEditingId(null); }} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Platform">
              <SelectInput value={draft.platform} onChange={(event) => update('platform', event.target.value as SocialPlatform)}>
                <option value="youtube">YouTube</option>
                <option value="kick">Kick</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </SelectInput>
            </Field>
            <Field label="Title" required className="sm:col-span-2">
              <TextInput value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Dojo Cup #7 Grand Finals" />
            </Field>
            <Field label="Video URL" hint="Paste the link, then leave the field or press Auto-fill to load the title, thumbnail, and stats." className="sm:col-span-2">
              <div className="flex items-center gap-2">
                <TextInput
                  value={draft.url}
                  onChange={(event) => {
                    previewedUrl.current = '';
                    update('url', event.target.value);
                  }}
                  onBlur={() => loadPreview()}
                  className="min-w-0 flex-1"
                  placeholder="https://youtube.com/watch?v=… / https://www.tiktok.com/@…/video/… / instagram.com/reel/…"
                />
                <AdminButton
                  variant="ghost"
                  onClick={() => loadPreview()}
                  disabled={previewing || !draft.url.trim()}
                  className="shrink-0 !px-3"
                >
                  {previewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span className="hidden sm:inline">{previewing ? 'Fetching…' : 'Auto-fill'}</span>
                </AdminButton>
              </div>
            </Field>
            <div className="sm:col-span-2">
              <ImageField
                value={draft.thumb}
                onChange={(value) => update('thumb', value)}
                label="Thumbnail"
                hint="Leave blank for YouTube links — it is filled in automatically."
              />
            </div>
            <Field label="Duration" hint="e.g. 12:34">
              <TextInput value={draft.duration ?? ''} onChange={(event) => update('duration', event.target.value)} placeholder="12:34" />
            </Field>
            <Field label="Views">
              <TextInput value={draft.views ?? ''} onChange={(event) => update('views', event.target.value)} placeholder="12000" />
            </Field>
            <Field label="Likes">
              <TextInput value={draft.likes ?? ''} onChange={(event) => update('likes', event.target.value)} placeholder="450" />
            </Field>
            <Field label="Published date">
              <TextInput
                type="date"
                value={toDateInput(draft.publishedAt ?? '')}
                onChange={(event) => update('publishedAt', event.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <AdminButton type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add video'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setDraft(null); setEditingId(null); }}>
              Cancel
            </AdminButton>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyHint title="No manual videos yet" hint="Add a YouTube video or Kick clip to pin it to the Socials page." />
      ) : (
        <div className="space-y-2.5">
          {items.map((video) => (
            <div
              key={video.id}
              className={`flex items-center gap-3 rounded-2xl border p-3 sm:gap-4 ${isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white'}`}
            >
              <div className={`h-14 w-24 shrink-0 overflow-hidden rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-100'}`}>
                {video.thumb ? (
                  <img src={proxiedImageUrl(video.thumb)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-500"><Play className="h-5 w-5" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold">{video.title || 'Untitled video'}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${PLATFORM_BADGE[video.platform]}`}>
                    {video.platform}
                  </span>
                </div>
                <p className={`truncate text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {[video.duration, video.publishedAt].filter(Boolean).join(' · ') || 'No details yet'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <AdminButton variant="ghost" onClick={() => startEdit(video)} disabled={saving} className="!px-3">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(video)} disabled={saving} className="!px-3">
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
