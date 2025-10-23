import type { AccountViewPath } from '../../lib/view-paths';
import type { BaseProps, CardClassNames } from '../../types/ui';

export interface AccountViewProps extends BaseProps {
  classNames?: {
    nav?: {
      base?: string;
      tabs?: string;
      tabsList?: string;
      tabsTrigger?: string;
      content?: string;
    };
    baseCards?: string;
    card?: CardClassNames;
  };
  disableNavigation?: boolean;
  path?: string;
  pathname?: string;
  view?: AccountViewPath;
}

export interface AccountBaseProps extends BaseProps {
  classNames?: CardClassNames;
}
