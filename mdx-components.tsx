import type { MDXComponents } from 'mdx/types';
import { AdSlot } from '@/components/ads/ad-slot';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    AdSlot,
  };
}
