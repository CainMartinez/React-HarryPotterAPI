import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const TRANSITION_DURATION_MS = 3200;

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [phase, setPhase] = useState('idle');
  const [transitionKey, setTransitionKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const isFirstLoad = useRef(true);
  const prevPath = useRef(location.pathname);
  const animationFrameRef = useRef(null);

  const startTransition = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setProgress(0);
    setPhase('active');
    setTransitionKey((previousKey) => previousKey + 1);

    const startedAt = performance.now();

    const step = (now) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.min(elapsed / TRANSITION_DURATION_MS, 1);
      setProgress(nextProgress);

      if (nextProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
        setPhase('idle');
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      prevPath.current = location.pathname;
      return;
    }
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      startTransition();
    }
  }, [location.pathname, startTransition]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const maskId = `castle-hole-mask-${transitionKey}`;
  const easedProgress = easeOutCubic(progress);
  const castleScale = 0.06 + (3.8 - 0.06) * easedProgress;
  const overlayOpacity = progress < 0.97 ? 1 : 1 - (progress - 0.97) / 0.03;

  return (
    <>
      {phase === 'active' && (
        <div className="page-transition" aria-hidden="true" key={transitionKey}>
          <svg className="transition-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="white" />
                <g
                  className="castle-hole"
                  style={{ transform: `scale(${castleScale})` }}
                >
                  <polygon
                    className="castle-shape"
                    fill="black"
                    points="15,30 22.5,20 30,30 30,30 25,40 25,40 50,20 75,40 75,40 70,30 70,30 77.5,20 85,30 85,100 15,100"
                  />
                </g>
              </mask>
            </defs>
            <rect
              width="100"
              height="100"
              className="transition-overlay"
              mask={`url(#${maskId})`}
              style={{ opacity: Math.max(0, Math.min(1, overlayOpacity)) }}
            />
          </svg>
        </div>
      )}
      {children}
    </>
  );
};

export default PageTransition;
