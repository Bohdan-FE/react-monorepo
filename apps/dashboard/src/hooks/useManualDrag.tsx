import { useStore } from '../store/store';
import { MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react';

export function useManualDrag() {
  const setPosition = useStore(state => state.setPosition);
  const setDragData = useStore(state => state.setDragData);
  const onDragEnd = useStore(state => state.onDragEnd);
  const setPreview = useStore(state => state.setPreview);
  const setDraggableElement = useStore(state => state.setDraggableElement);
  const setOffset = useStore(state => state.setOffset);

  const onDragEndRef = useRef<() => void | null>(null);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  const handleMouseDown = (e: ReactMouseEvent, dragData: any) => {
    setDragData(dragData);
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

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      onDragEndRef.current?.();
      setDraggableElement(null);
      setTimeout(() => {
        setDragData(null);
      }, 300);
      setPosition({ x: 0, y: 0 });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { handleMouseDown };
}
