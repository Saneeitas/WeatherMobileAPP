import { useContext } from 'react';
import { LocationContext } from '@/context/LocationContext';

/**
 * Custom hook to access location context.
 * Must be used within a LocationProvider.
 */
export function useLocation() {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }

  return context;
}
