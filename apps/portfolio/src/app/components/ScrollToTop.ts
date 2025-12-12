import { useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    // fires when navigation is finished
    if (navigation.state === 'idle') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, navigation.state]);

  return null;
}
