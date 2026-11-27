import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, localSiteContent, type SiteContent } from '../lib/api';

interface ContentContextValue {
  content: SiteContent;
  source: 'api' | 'local';
}

const ContentContext = createContext<ContentContextValue>({
  content: localSiteContent,
  source: 'local',
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(localSiteContent);
  const [source, setSource] = useState<'api' | 'local'>('local');

  useEffect(() => {
    let active = true;
    api.site()
      .then((response) => {
        if (active && response.data) {
          setContent(response.data);
          setSource('api');
        }
      })
      .catch(() => {
        // Static content is a complete fallback when the API is unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ content, source }), [content, source]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
