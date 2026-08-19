import { useState, useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (fetchMore, hasMore, loading) => {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [loading, hasMore, fetchMore]);

  return loadMoreRef;
};

export default useInfiniteScroll;
