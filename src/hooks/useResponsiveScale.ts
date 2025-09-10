import { useState, useLayoutEffect, useRef } from 'react';

const useResponsiveScale = (targetWidth: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setScale(width / targetWidth);
      }
    });

    resizeObserver.observe(currentContainer);

    return () => resizeObserver.disconnect();
  }, [targetWidth]);

  return { scale, containerRef };
};

export default useResponsiveScale;
