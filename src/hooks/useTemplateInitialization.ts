import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import type { AppDispatch } from '../store';
import { createListsFromTemplate } from '../features/lists';
import { createCardsFromTemplate } from '../features/cards';
import { getTemplateById } from '../data/boardTemplates';

export const useTemplateInitialization = (boardId: string | undefined, userId: string | undefined) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const templateId = searchParams.get('template');
    const shouldInitialize = searchParams.get('init') === 'true';
    
    if (boardId && userId && templateId && shouldInitialize) {
      const template = getTemplateById(templateId);
      
      if (template) {
        console.log('Initializing board with template:', template.name);
        
        // Create lists from template
        dispatch(createListsFromTemplate({
          boardId,
          templateLists: template.lists,
        })).then((listResult) => {
          if (listResult.meta.requestStatus === 'fulfilled') {
            // Create a mapping from template list index to actual list ID
            const listMapping: Record<string, string> = {};
            const createdLists = (listResult.payload as any).lists;
            
            createdLists.forEach((list: any, index: number) => {
              listMapping[index.toString()] = list.id;
            });
            
            // Create cards from template
            dispatch(createCardsFromTemplate({
              templateLists: template.lists,
              listMapping,
              userId,
            }));
          }
        });
        
        // Remove the template params from URL to prevent re-initialization
        searchParams.delete('template');
        searchParams.delete('init');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [boardId, userId, dispatch, searchParams, setSearchParams]);
};
