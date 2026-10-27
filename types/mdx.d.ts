import type { ComponentType } from 'react';

declare module '*.mdx' {
  const MdxComponent: ComponentType<Record<string, unknown>>;
  export default MdxComponent;
}
