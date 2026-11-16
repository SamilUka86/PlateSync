import React, { useEffect } from 'react';
import { WeightConverter } from '../../components/converter/WeightConverter';

export const WeightConversionPage = ({ setActiveTab }) => {
  // Ensure screen always starts from the top on mobile and desktop
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <WeightConverter isEmbedded={false} setActiveTab={setActiveTab} />
    </div>
  );
};
