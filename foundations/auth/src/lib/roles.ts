import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access';

export const ac = createAccessControl(defaultStatements);

export const adminRole = ac.newRole({
  ...adminAc.statements,
});

export const userRole = ac.newRole({
  ...userAc.statements,
});

export const clientRole = ac.newRole({
  ...userAc.statements,
});
