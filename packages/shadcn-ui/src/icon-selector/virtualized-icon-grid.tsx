'use client';

import type { VirtualItem } from '@tanstack/react-virtual';
import type { FC } from 'react';

import { Icon } from '@iconify/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Optimized Virtualized Icon Grid Component (TanStack Virtual version)
 * Renders a performant icon grid with virtualization using @tanstack/react-virtual
 * Features:
 * - Dynamic responsive columns based on container width
 * - Optimized rendering with proper memoization
 * - Vertical virtualization only (horizontal scrolling handled by CSS grid)
 * - Minimal re-renders through proper dependency management
 * Install: pnpm add @tanstack/react-virtual
 */
interface VirtualizedIconGridProps {
  icons: string[];
  onSelectIcon: (iconName: string) => void;
  maxHeight?: string | number;
  columnCount?: number;
  cellSize?: number; // Width of each cell in pixels
}

const CELL_SIZE_DEFAULT = 80; // Width of each cell (includes padding)
const ROW_HEIGHT = 80;
const DEFAULT_HEIGHT = 480;
const MIN_COLUMNS = 3;

interface IconCellProps {
  iconName: string;
  onSelectIcon: (iconName: string) => void;
}

// Memoized icon cell component - only re-renders when iconName or onSelectIcon changes
const IconCell = React.memo<IconCellProps>(({ iconName, onSelectIcon }) => {
  if (!iconName) {
    return null;
  }

  const displayName = iconName.split(':')[1] ?? iconName;

  return (
    <button
      type="button"
      onClick={() => onSelectIcon(iconName)}
      className="w-full h-full flex flex-col items-center justify-center gap-1 rounded-md border border-transparent hover:border-primary hover:bg-accent transition-colors p-1"
      title={iconName}
    >
      <Icon icon={iconName} width="24" height="24" />
      <span className="truncate text-xs text-muted-foreground max-w-full">
        {displayName}
      </span>
    </button>
  );
});

IconCell.displayName = 'IconCell';

const VirtualizedIconGrid: FC<VirtualizedIconGridProps> = ({
  icons,
  onSelectIcon,
  maxHeight = DEFAULT_HEIGHT,
  columnCount: providedColumnCount,
  cellSize = CELL_SIZE_DEFAULT,
}) => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Calculate dynamic column count based on container width
  const columnCount = useMemo(() => {
    if (providedColumnCount !== undefined && providedColumnCount > 0) {
      return providedColumnCount; // Use provided column count if explicitly set
    }

    if (containerWidth === 0) {
      return MIN_COLUMNS;
    }

    return Math.max(MIN_COLUMNS, Math.floor(containerWidth / cellSize));
  }, [containerWidth, cellSize, providedColumnCount]);

  // Setup ResizeObserver to track container width changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const height = typeof maxHeight === 'number' ? maxHeight : DEFAULT_HEIGHT;

  // Calculate row count based on dynamic column count
  const rowCount = useMemo(
    () => Math.ceil(icons.length / columnCount),
    [icons.length, columnCount],
  );

  // Create row virtualizer (vertical virtualization only)
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows: VirtualItem[] = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      onSelectIcon(iconName);
    },
    [onSelectIcon],
  );

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {containerRef.current && (
        <div
          ref={scrollableRef}
          style={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
            flex: 1,
          }}
        >
          <div
            style={{
              height: `${totalSize}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualRows.map((virtualRow) => {
              const startIndex = virtualRow.index * columnCount;
              const endIndex = Math.min(startIndex + columnCount, icons.length);
              const rowIcons = icons.slice(startIndex, endIndex);

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                      height: '100%',
                      width: '100%',
                      gap: '0',
                    }}
                  >
                    {rowIcons.map((iconName) => (
                      <div
                        key={iconName}
                        style={{
                          minHeight: '100%',
                          minWidth: '0',
                        }}
                      >
                        <IconCell iconName={iconName} onSelectIcon={handleSelectIcon} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualizedIconGrid;
