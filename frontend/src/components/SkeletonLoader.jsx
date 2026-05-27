import React from 'react';

const SkeletonLoader = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-alert" />
      ))}
    </>
  );
};

export default SkeletonLoader;
