import React, {useEffect, useState, useRef, useMemo, Ref} from 'react';

type Props = {
    onBottomHit: () => void;
    isLoading: boolean;
    hasMoreData: boolean;
    loadOnMount: boolean;
    children: any;
  };
  
  function isBottom(ref: React.RefObject<HTMLDivElement>) {
    if (!ref.current) {
      return false;
    }
    return ref.current.getBoundingClientRect().bottom <= window.innerHeight;
  }
  
  const InfiniteScroll: React.FC<Props> = ({
    onBottomHit,
    isLoading,
    hasMoreData,
    loadOnMount,
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (loadOnMount && initialLoad) {
        onBottomHit();
        setInitialLoad(false);
      }
    }, [onBottomHit, loadOnMount, initialLoad]);    
  
    useEffect(() => {
        if((window.visualViewport!.height >= contentRef.current?.scrollHeight!) && !isLoading && hasMoreData)
          onBottomHit();
      const onScroll = () => {
        if (!isLoading && hasMoreData && isBottom(contentRef)) {
          onBottomHit();
        }
      };
      document.addEventListener('scroll', onScroll);
      return () => document.removeEventListener('scroll', onScroll);
    }, [onBottomHit, isLoading, hasMoreData]);
  
    return <div ref={contentRef}>{children}</div>;
  };

  export default InfiniteScroll;