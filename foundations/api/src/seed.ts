import { logger } from '@pelatform/utils';
import { generateSecurePassword } from '@pelatform/utils/server';
import { auth } from '@repo/auth';
import { createAccount, createUser, getUserByEmail } from '@repo/db';

export async function createNewUser() {
  logger.info("Let's create a new user for your application!");

  const email = await logger.prompt('Enter an email:', {
    required: true,
    placeholder: 'admin@example.com',
    type: 'text',
  });

  const name = await logger.prompt('Enter a name:', {
    required: true,
    placeholder: 'Admin',
    type: 'text',
  });

  const isAdmin = await logger.prompt('Should user be an admin?', {
    required: true,
    type: 'confirm',
    default: false,
  });

  logger.start('Creating user...');

  const authContext = await auth.$context;
  const password = generateSecurePassword();
  const hashedPassword = await authContext.password.hash(password);

  // check if user exists
  const user = await getUserByEmail(email);
  if (user) {
    logger.error('User with this email already exists!');
    return;
  }

  const newUser = await createUser({
    email,
    name,
    role: isAdmin ? 'admin' : 'user',
    emailVerified: true,
  });

  if (!newUser) {
    logger.error('Failed to create user!');
    return;
  }

  await createAccount({
    userId: newUser.id,
    accountId: newUser.id,
    providerId: 'credential',
    password: hashedPassword,
  });

  logger.success('User created successfully!');
  logger.info(`Here is the password for the new user: ${password}`);

  return newUser;
}
