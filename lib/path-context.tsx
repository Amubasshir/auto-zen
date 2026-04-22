'use client';

import { createContext, useContext } from 'react';
import type { PathType } from './path-filter';

const PathContext = createContext<PathType>('developer');

export function PathProvider({
  pathType,
  children,
}: {
  pathType: PathType;
  children: React.ReactNode;
}) {
  return <PathContext.Provider value={pathType}>{children}</PathContext.Provider>;
}

export function usePathType(): PathType {
  return useContext(PathContext);
}
