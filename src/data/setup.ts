import type { FC } from 'react';
import {
  Box,
  Cable,
  Camera,
  CircleDot,
  Cpu,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  LayoutGrid,
  Lightbulb,
  Mic,
  Monitor,
  Mouse,
  SlidersHorizontal,
  Speaker,
  Tv,
  Volume2,
  Wifi,
  Zap,
} from 'lucide-react';

import battlestationImg from '../assets/images/Setup.jpeg';
import pcRigImg from '../assets/images/setup-pc-rig.jpg';
import monitorImg from '../assets/images/setup-monitor.jpg';
import keyboardImg from '../assets/images/setup-keyboard.jpg';
import mouseImg from '../assets/images/setup-mouse.jpg';
import controllerImg from '../assets/images/esports-soccer.jpg';
import micImg from '../assets/images/setup-microphone.jpg';
import mousepadImg from '../assets/images/setup-mousepad.jpg';

export interface SetupHotspot {
  x: number;
  y: number;
}

export interface SetupItem {
  id: string;
  name: string;
  category: string;
  spec: string;
  icon: string;
  hotspot: SetupHotspot;
  image: string;
}

export interface SetupContent {
  backgroundImage: string;
  items: SetupItem[];
}

type SetupIconComponent = FC<{ className?: string }>;

export const SETUP_ICON_OPTIONS: Array<{ key: string; label: string; Icon: SetupIconComponent }> = [
  { key: 'cpu', label: 'PC', Icon: Cpu },
  { key: 'monitor', label: 'Monitor', Icon: Monitor },
  { key: 'keyboard', label: 'Keyboard', Icon: Keyboard },
  { key: 'mouse', label: 'Mouse', Icon: Mouse },
  { key: 'mic', label: 'Microphone', Icon: Mic },
  { key: 'gamepad', label: 'Controller', Icon: Gamepad2 },
  { key: 'layout', label: 'Control deck', Icon: LayoutGrid },
  { key: 'dot', label: 'Surface', Icon: CircleDot },
  { key: 'zap', label: 'Power', Icon: Zap },
  { key: 'speaker', label: 'Speaker', Icon: Speaker },
  { key: 'headphones', label: 'Headset', Icon: Headphones },
  { key: 'camera', label: 'Camera', Icon: Camera },
  { key: 'tv', label: 'TV', Icon: Tv },
  { key: 'harddrive', label: 'Drive', Icon: HardDrive },
  { key: 'wifi', label: 'Network', Icon: Wifi },
  { key: 'cable', label: 'Cable', Icon: Cable },
  { key: 'sliders', label: 'Mixer', Icon: SlidersHorizontal },
  { key: 'volume', label: 'Audio', Icon: Volume2 },
  { key: 'lightbulb', label: 'Lighting', Icon: Lightbulb },
  { key: 'box', label: 'Other', Icon: Box },
];

const ICON_MAP: Record<string, SetupIconComponent> = SETUP_ICON_OPTIONS.reduce(
  (map, option) => ({ ...map, [option.key]: option.Icon }),
  {},
);

export function getSetupIcon(key: string | undefined): SetupIconComponent {
  return (key && ICON_MAP[key]) || Box;
}

export const defaultSetup: SetupContent = {
  backgroundImage: battlestationImg,
  items: [
    { id: '01', name: 'Gaming Pc', category: 'PC', spec: '', hotspot: { x: 82, y: 32 }, image: pcRigImg, icon: 'cpu' },
    { id: '02', name: 'Monitor 1', category: 'Monitor', spec: '', hotspot: { x: 50, y: 42 }, image: monitorImg, icon: 'monitor' },
    { id: '03', name: 'Hall Effect Keyboard', category: 'Keyboard', spec: '', hotspot: { x: 52, y: 69 }, image: keyboardImg, icon: 'keyboard' },
    { id: '04', name: 'Pro Wireless Mouse', category: 'Mouse', spec: '', hotspot: { x: 62, y: 66 }, image: mouseImg, icon: 'mouse' },
    { id: '05', name: 'Broadcast Microphone', category: 'Mic', spec: '', hotspot: { x: 65, y: 49 }, image: micImg, icon: 'mic' },
    { id: '06', name: 'Xbox Wireless Controller', category: 'Controller', spec: '', hotspot: { x: 55, y: 60 }, image: controllerImg, icon: 'gamepad' },
    { id: '07', name: 'RODE RodeCaster Pro II', category: 'Control', spec: '', hotspot: { x: 71, y: 57 }, image: battlestationImg, icon: 'layout' },
    { id: '08', name: 'Pro Esports Mousepad', category: 'Surface', spec: '', hotspot: { x: 48, y: 76 }, image: mousepadImg, icon: 'dot' },
    { id: '09', name: 'Streaming PC', category: 'PC', spec: '', hotspot: { x: 68, y: 80 }, image: mousepadImg, icon: 'cpu' },
    { id: '10', name: 'Monitor 2', category: 'Monitor', spec: '', hotspot: { x: 33, y: 60 }, image: mousepadImg, icon: 'monitor' },
    { id: '11', name: 'Monitor 3', category: 'Monitor', spec: '', hotspot: { x: 69, y: 33 }, image: mousepadImg, icon: 'monitor' },
  ],
};
