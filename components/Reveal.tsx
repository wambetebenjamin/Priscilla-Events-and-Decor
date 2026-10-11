'use client';

/**
 * Reveal on scroll.
 *
 * The design source used AOS with the exact configuration:
 *   AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false })
 *
 * This reproduces that contract with an IntersectionObserver and no dependency:
 * 600ms, ease-in-out, animate once, never mirror. The delay is passed per item so
 * grids can stagger, which is the one thing AOS did that the CSS alone cannot.
 */

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
  /** 'up' is the default rise. 'scale' is a soft zoom, used for media. */
  variant?: 'up' | 'scale';
  as?: ElementType;
};

export default function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'up',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Honour reduced motion: show it immediately and never observe.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            // once: true. Stop watching the moment it has played.
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${variant === 'scale' ? 'reveal-scale' : 'reveal'} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
