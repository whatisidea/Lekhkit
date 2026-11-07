import {
  AtSign, Check, ChevronDown, Copy, Ellipsis, FileText, Globe, Heart, Image as ImageIcon, Info,
  List, ListOrdered, Maximize2, Plus, MessageSquare, Monitor, Moon, Paperclip, Play, RemoveFormatting,
  Repeat2, Send, Smartphone, Smile, Sun, ThumbsUp, Trash2, TriangleAlert, Undo2, Redo2, Video, X,
  type LucideIcon,
} from 'lucide-react';

const MAP = {
  undo: Undo2, redo: Redo2, list: List, olist: ListOrdered, smile: Smile, clip: Paperclip, at: AtSign,
  nofmt: RemoveFormatting, trash: Trash2, chev: ChevronDown, copy: Copy, check: Check, x: X, sun: Sun,
  moon: Moon, expand: Maximize2, image: ImageIcon, video: Video, doc: FileText, warn: TriangleAlert,
  info: Info, globe: Globe, more: Ellipsis, like: ThumbsUp, comment: MessageSquare, repost: Repeat2,
  send: Send, plus: Plus, play: Play, phone: Smartphone, monitor: Monitor, heart: Heart,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof MAP;

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = MAP[name];
  return <C className={'ic' + (className ? ' ' + className : '')} aria-hidden="true" />;
}
