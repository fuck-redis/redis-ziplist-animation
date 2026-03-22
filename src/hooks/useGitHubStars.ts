import { useEffect, useMemo, useState } from 'react';
import { idbGet, idbSet } from '@/lib/indexedDb';

const CACHE_KEY = 'github-stars-cache';
const CACHE_TTL_MS = 60 * 60 * 1000;

interface StarsCache {
  stars: number;
  ts: number;
}

function parseRepoUrl(rawUrl: string): { owner: string; repo: string } | null {
  if (!rawUrl) {
    return null;
  }
  const normalized = rawUrl
    .replace(/^git@github.com:/, 'https://github.com/')
    .replace(/\.git$/, '');

  const matched = normalized.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!matched) {
    return null;
  }
  return { owner: matched[1], repo: matched[2] };
}

export function useGitHubStars(repoUrl: string) {
  const [stars, setStars] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const parsed = useMemo(() => parseRepoUrl(repoUrl), [repoUrl]);

  useEffect(() => {
    let canceled = false;

    async function run() {
      const cached = await idbGet<StarsCache>(CACHE_KEY);
      const now = Date.now();

      if (cached && now - cached.ts < CACHE_TTL_MS) {
        if (!canceled) {
          setStars(cached.stars);
          setLoaded(true);
        }
        return;
      }

      if (!parsed) {
        if (!canceled) {
          setStars(cached?.stars ?? 0);
          setLoaded(true);
        }
        return;
      }

      try {
        const resp = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
        if (!resp.ok) {
          throw new Error(`github api status ${resp.status}`);
        }
        const data = (await resp.json()) as { stargazers_count?: number };
        const nextStars = typeof data.stargazers_count === 'number' ? data.stargazers_count : 0;
        await idbSet<StarsCache>(CACHE_KEY, { stars: nextStars, ts: now });
        if (!canceled) {
          setStars(nextStars);
          setLoaded(true);
        }
      } catch {
        if (!canceled) {
          setStars(cached?.stars ?? 0);
          setLoaded(true);
        }
      }
    }

    void run();
    return () => {
      canceled = true;
    };
  }, [parsed]);

  return { stars, loaded };
}
