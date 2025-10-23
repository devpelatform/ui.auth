import type { OrganizationViewPath } from '../../lib/view-paths';
import type { BaseProps, CardClassNames } from '../../types/ui';

export interface OrganizationViewProps extends BaseProps {
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
  view?: OrganizationViewPath;
}

export interface OrganizationBaseProps extends BaseProps {
  classNames?: CardClassNames;
}
