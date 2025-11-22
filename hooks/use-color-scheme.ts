'use client'

import { useTheme } from 'next-themes';
import * as React from 'react';

export function useColorScheme() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? 'dark' : 'light';
}
