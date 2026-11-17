import type { ReactNode } from 'react';
import type { Species } from '../pet/sprites';

export type Win = {
  /** The app id, which doubles as the window key: each app opens at most one window. */
  app: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
};

export type OsApi = {
  open: (app: string) => void;
  close: (app: string) => void;
  setRecruiter: (on: boolean) => void;
  species: Species;
  setSpecies: (s: Species) => void;
};

export type AppDef = {
  title: string;
  icon: string;
  color: string;
  w: number;
  h: number;
  petLine?: string;
  render: (os: OsApi) => ReactNode;
};
