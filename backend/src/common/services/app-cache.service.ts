import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

@Injectable()
export class AppCacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): T {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });

    return value;
  }

  async getOrSet<T>(
    key: string,
    ttlMs: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const freshValue = await factory();
    return this.set(key, freshValue, ttlMs);
  }

  invalidate(keyPrefix: string) {
    for (const key of this.store.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.store.delete(key);
      }
    }
  }
}
