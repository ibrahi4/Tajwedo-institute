import { createMetadata } from './metadata';
import type { Metadata } from 'next';

interface BuildSeoProps {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  ogImage?: string;
}

export function buildPageMetadata({
  title,
  description,
  path = '',
  locale = 'en',
  ogImage,
}: BuildSeoProps): Metadata {
  return createMetadata({
    title,
    description,
    path,
    locale,
    ogImage,
  });
}

export default buildPageMetadata;