import { render } from '@testing-library/react';

import AcmeUi from './ui';

describe('AcmeUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AcmeUi />);
    expect(baseElement).toBeTruthy();
  });
});
