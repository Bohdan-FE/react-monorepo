import { useStore } from '../store/store';
import { MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react';

export function useManualDrag() {
  const setPosition = useStore((state) => state.setPosition);
  const setDragData = useStore((state) => state.setDragData);
  const onDragEnd = useStore((state) => state.onDragEnd);
  const setPreview = useStore((state) => state.setPreview);
  const setDraggableElement = useStore((state) => state.setDraggableElement);
  const draggableElement = useStore((state) => state.draggableElement);
  const setOffset = useStore((state) => state.setOffset);
  const setEndPosition = useStore((state) => state.setEndPosition);
  const onDragEndRef = useRef<() => void | null>(null);
  const dragElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
    dragElementRef.current = draggableElement as HTMLElement | null;
  }, [onDragEnd, draggableElement]);

  const handleMouseDown = (e: ReactMouseEvent, dragData: any) => {
    setDraggableElement(e.currentTarget);
    setPosition({ x: e.clientX, y: e.clientY });
    setPreview({
      width: e.currentTarget.clientWidth,
      height: e.currentTarget.clientHeight,
    });
    const rect = e.currentTarget.getBoundingClientRect();

    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDragData(dragData);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      onDragEndRef.current?.();
      const el = dragElementRef.current;
      if (el) {
        setEndPosition({
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
        });
      }
      setTimeout(() => {
        setDraggableElement(null);
      }, 0);
      setTimeout(() => {
        setDragData(null);
      }, 300);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { handleMouseDown };
}
