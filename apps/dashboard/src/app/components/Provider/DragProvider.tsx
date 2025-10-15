import React, { useEffect } from 'react';
import { useStore } from '../../../store/store';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';

function DragProvider() {
  const { draggableElement, position, previewSize, offset, endPosition } =
    useStore((state) => state);

  const copy = draggableElement?.cloneNode(true) as HTMLElement | null;

  if (copy) {
    copy.style.opacity = '1';
  }

  return (
    <AnimatePresence>
      {draggableElement && (
        <motion.div
          exit={{
            left: endPosition.x,
            top: endPosition.y,
            transition: { duration: 0.3 },
          }}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            left: position.x - offset.x,
            top: position.y - offset.y,
            zIndex: 20,
            width: previewSize.width,
            height: previewSize.height,
            opacity: 1,
          }}
        >
          {React.createElement('div', {
            dangerouslySetInnerHTML: { __html: copy?.outerHTML || '' },
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DragProvider;
