/* @private */

// General application strings
export const GENERAL_STRINGS = {
  APP: 'Pelatform',
  // CONTINUE: 'Continue',
  // CANCEL: 'Cancel',
  // SAVE: 'Save',
  // DELETE: 'Delete',
  // DONE: 'Done',
  UPLOAD: 'Upload',
  // LINK: 'Link',
  // UNLINK: 'Unlink',
  // REVOKE: 'Revoke',
  // ACCEPT: 'Accept',
  // REJECT: 'Reject',
  GO_BACK: 'Go back',
  // UNKNOWN: 'Unknown',
  IS_INVALID: 'is invalid',
  IS_REQUIRED: 'is required',
  // IS_THE_SAME: 'is the same',
  // UPDATED_SUCCESSFULLY: 'updated successfully',
  REQUEST_FAILED: 'Request failed',
  // COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  // COPY_TO_CLIPBOARD: 'Copy to clipboard',
};

// Account related strings
export const ACCOUNT_STRINGS = {
  ACCOUNT: 'Account',
  // ACCOUNTS: 'Accounts',
  // ACCOUNTS_DESCRIPTION: 'Switch between your currently signed in accounts.',
  // ACCOUNTS_INSTRUCTIONS: 'Sign in to an additional account.',
  ADD_ACCOUNT: 'Add Account',
  // SWITCH_ACCOUNT: 'Switch Account',
  PERSONAL_ACCOUNT: 'Personal Account',
  // CURRENT_SESSION: 'Current Session',
  // DELETE_ACCOUNT: 'Delete Account',
  // DELETE_ACCOUNT_DESCRIPTION: 'Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution.',
  // DELETE_ACCOUNT_INSTRUCTIONS: 'Please confirm the deletion of your account. This action is not reversible, so please continue with caution.',
  // DELETE_ACCOUNT_VERIFY: 'Please check your email to verify the deletion of your account.',
  // DELETE_ACCOUNT_SUCCESS: 'Your account has been deleted.',
};

// Authentication strings
export const AUTH_STRINGS = {
  SIGN_IN: 'Sign In',
  SIGN_IN_ACTION: 'Login',
  // SIGN_IN_DESCRIPTION: 'Enter your email below to login to your account',
  // SIGN_IN_USERNAME_DESCRIPTION: 'Enter your username or email to login to your account',
  SIGN_IN_WITH: 'Sign in with',
  SIGN_OUT: 'Sign Out',
  SIGN_UP: 'Sign Up',
  SIGN_UP_ACTION: 'Create an account',
  // SIGN_UP_DESCRIPTION: 'Enter your information to create an account',
  SIGN_UP_EMAIL: 'Check your email for the verification link.',
  ALREADY_HAVE_AN_ACCOUNT: 'Already have an account?',
  DONT_HAVE_AN_ACCOUNT: "Don't have an account?",
  OR_CONTINUE_WITH: 'Or continue with',
  REMEMBER_ME: 'Remember me',
  TRUST_DEVICE: 'Trust this device',
  // SESSION_NOT_FRESH: 'Your session is not fresh. Please sign in again.',
};

// Form field strings
export const FORM_STRINGS = {
  EMAIL: 'Email',
  // EMAIL_DESCRIPTION: 'Enter the email address you want to use to log in.',
  // EMAIL_INSTRUCTIONS: 'Please enter a valid email address.',
  EMAIL_PLACEHOLDER: 'm@example.com',
  // EMAIL_REQUIRED: 'Email address is required',
  // EMAIL_IS_THE_SAME: 'Email is the same',
  // EMAIL_VERIFY_CHANGE: 'Please check your email to verify the change.',
  // EMAIL_VERIFICATION: 'Please check your email for the verification link.',

  PASSWORD: 'Password',
  PASSWORD_PLACEHOLDER: 'Password',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

  CONFIRM_PASSWORD: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm Password',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',

  // CURRENT_PASSWORD: 'Current Password',
  // CURRENT_PASSWORD_PLACEHOLDER: 'Current Password',

  NEW_PASSWORD: 'New Password',
  NEW_PASSWORD_PLACEHOLDER: 'New Password',
  NEW_PASSWORD_REQUIRED: 'New password is required',

  NAME: 'Name',
  // NAME_DESCRIPTION: 'Please enter your full name, or a display name.',
  // NAME_INSTRUCTIONS: 'Please use 32 characters at maximum.',
  NAME_PLACEHOLDER: 'Name',

  USERNAME: 'Username',
  // USERNAME_DESCRIPTION: 'Enter the username you want to use to log in.',
  // USERNAME_INSTRUCTIONS: 'Please use 32 characters at maximum.',
  USERNAME_PLACEHOLDER: 'Username',
  SIGN_IN_USERNAME_PLACEHOLDER: 'Username or email',
};

// Password management strings
export const PASSWORD_STRINGS = {
  // CHANGE_PASSWORD: 'Change Password',
  // CHANGE_PASSWORD_DESCRIPTION: 'Enter your current password and a new password.',
  // CHANGE_PASSWORD_INSTRUCTIONS: 'Please use 8 characters at minimum.',
  // CHANGE_PASSWORD_SUCCESS: 'Your password has been changed.',
  // FORGOT_PASSWORD: 'Forgot Password',
  FORGOT_PASSWORD_ACTION: 'Send reset link',
  // FORGOT_PASSWORD_DESCRIPTION: 'Enter your email to reset your password',
  FORGOT_PASSWORD_EMAIL: 'Check your email for the password reset link.',
  FORGOT_PASSWORD_LINK: 'Forgot your password?',
  // RESET_PASSWORD: 'Reset Password',
  RESET_PASSWORD_ACTION: 'Save new password',
  // RESET_PASSWORD_DESCRIPTION: 'Enter your new password below',
  RESET_PASSWORD_SUCCESS: 'Password reset successfully',
  // SET_PASSWORD: 'Set Password',
  // SET_PASSWORD_DESCRIPTION: 'Click the button below to receive an email to set up a password for your account.',
};

// Magic link and OTP strings
export const MAGIC_LINK_STRINGS = {
  MAGIC_LINK: 'Magic Link',
  MAGIC_LINK_ACTION: 'Send magic link',
  // MAGIC_LINK_DESCRIPTION: 'Enter your email to receive a magic link',
  MAGIC_LINK_EMAIL: 'Check your email for the magic link',
  EMAIL_OTP: 'Email Code',
  EMAIL_OTP_SEND_ACTION: 'Send code',
  EMAIL_OTP_VERIFY_ACTION: 'Verify code',
  // EMAIL_OTP_DESCRIPTION: 'Enter your email to receive a code',
  EMAIL_OTP_VERIFICATION_SENT: 'Please check your email for the verification code.',
  RESEND_CODE: 'Resend code',
  // RESEND_VERIFICATION_EMAIL: 'Resend Verification Email',
  SEND_VERIFICATION_CODE: 'Send verification code',
};

// Two-factor authentication strings
export const TWO_FACTOR_STRINGS = {
  // TWO_FACTOR: 'Two-Factor',
  TWO_FACTOR_ACTION: 'Verify code',
  // TWO_FACTOR_DESCRIPTION: 'Please enter your one-time password to continue',
  // TWO_FACTOR_CARD_DESCRIPTION: 'Add an extra layer of security to your account.',
  // TWO_FACTOR_DISABLE_INSTRUCTIONS: 'Please enter your password to disable 2FA.',
  // TWO_FACTOR_ENABLE_INSTRUCTIONS: 'Please enter your password to enable 2FA.',
  TWO_FACTOR_ENABLED: 'Two-factor authentication has been enabled',
  // TWO_FACTOR_DISABLED: 'Two-Factor Authentication has been disabled',
  // TWO_FACTOR_PROMPT: 'Two-Factor Authentication',
  TWO_FACTOR_TOTP_LABEL: 'Scan the QR Code with your Authenticator',
  // ENABLE_TWO_FACTOR: 'Enable Two-Factor',
  // DISABLE_TWO_FACTOR: 'Disable Two-Factor',
  ONE_TIME_PASSWORD: 'One-Time Password',
  CONTINUE_WITH_AUTHENTICATOR: 'Continue with Authenticator',
  FORGOT_AUTHENTICATOR: 'Forgot authenticator?',
  // BACKUP_CODES: 'Backup Codes',
  // BACKUP_CODES_DESCRIPTION: 'Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method.',
  BACKUP_CODE: 'Backup Code',
  BACKUP_CODE_PLACEHOLDER: 'Backup Code',
  BACKUP_CODE_REQUIRED: 'Backup code is required',
  // COPY_ALL_CODES: 'Copy all codes',
  // RECOVER_ACCOUNT: 'Recover Account',
  RECOVER_ACCOUNT_ACTION: 'Recover account',
  // RECOVER_ACCOUNT_DESCRIPTION: 'Please enter a backup code to access your account',
};

// Passkey strings
export const PASSKEY_STRINGS = {
  PASSKEY: 'Passkey',
  // PASSKEYS: 'Passkeys',
  // PASSKEYS_DESCRIPTION: 'Manage your passkeys for secure access.',
  // PASSKEYS_INSTRUCTIONS: 'Securely access your account without a password.',
  // ADD_PASSKEY: 'Add Passkey',
};

// API Keys strings
export const API_KEY_STRINGS = {
  // API_KEYS: 'API Keys',
  // API_KEYS_DESCRIPTION: 'Manage your API keys for secure access.',
  // API_KEYS_INSTRUCTIONS: 'Generate API keys to access your account programmatically.',
  // CREATE_API_KEY: 'Create API Key',
  // CREATE_API_KEY_DESCRIPTION: 'Enter a unique name for your API key to differentiate it from other keys.',
  // API_KEY_NAME_PLACEHOLDER: 'New API Key',
  // API_KEY_CREATED: 'API Key Created',
  // CREATE_API_KEY_SUCCESS: 'Please copy your API key and store it in a safe place. For security reasons we cannot show it again.',
  // NEVER_EXPIRES: 'Never Expires',
  // EXPIRES: 'Expires',
  // NO_EXPIRATION: 'No Expiration',
  // DELETE_API_KEY: 'Delete API Key',
  // DELETE_API_KEY_CONFIRM: 'Are you sure you want to delete this API key?',
  // API_KEY: 'API Key',
};

// Avatar and media strings
export const MEDIA_STRINGS = {
  AVATAR: 'Avatar',
  // AVATAR_DESCRIPTION: 'Click on the avatar to upload a custom one from your files.',
  // AVATAR_INSTRUCTIONS: 'An avatar is optional but strongly recommended.',
  UPLOAD_AVATAR: 'Upload Avatar',
  DELETE_AVATAR: 'Delete Avatar',
  // LOGO: 'Logo',
  // LOGO_DESCRIPTION: 'Click on the logo to upload a custom one from your files.',
  // LOGO_INSTRUCTIONS: 'A logo is optional but strongly recommended.',
  // UPLOAD_LOGO: 'Upload Logo',
  // DELETE_LOGO: 'Delete Logo',
};

// Session management strings
export const SESSION_STRINGS = {
  // SESSIONS: 'Sessions',
  // SESSIONS_DESCRIPTION: 'Manage your active sessions and revoke access.',
};

// Settings strings
export const SETTINGS_STRINGS = {
  SETTINGS: 'Settings',
  // SECURITY: 'Security',
  // PROVIDERS: 'Providers',
  // PROVIDERS_DESCRIPTION: 'Connect your account with a third-party service.',
  DISABLED_CREDENTIALS_DESCRIPTION: 'Choose a provider to login to your account',
};

// Email verification strings
export const EMAIL_VERIFICATION_STRINGS = {
  // VERIFY_YOUR_EMAIL: 'Verify Your Email',
  // VERIFY_YOUR_EMAIL_DESCRIPTION: "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend.",
};

// Legal and compliance strings
export const LEGAL_STRINGS = {
  PRIVACY_POLICY: 'Privacy Policy',
  TERMS_OF_SERVICE: 'Terms of Service',
  PROTECTED_BY_RECAPTCHA: 'This site is protected by reCAPTCHA.',
  BY_CONTINUING_YOU_AGREE: 'By continuing, you agree to the',
};

// User and role strings
export const USER_ROLE_STRINGS = {
  USER: 'User',
  // ROLE: 'Role',
  // SELECT_ROLE: 'Select a role',
  // ADMIN: 'Admin',
  // MEMBER: 'Member',
  // GUEST: 'Guest',
  // OWNER: 'Owner',
  // UPDATE_ROLE_DESCRIPTION: 'Update the role for this member',
  // UPDATE_ROLE: 'Update Role',
  // MEMBER_ROLE_UPDATED: 'Member role updated successfully',
};

// Organization strings
export const ORGANIZATION_STRINGS = {
  ORGANIZATION: 'Organization',
  // ORGANIZATIONS: 'Organizations',
  // ORGANIZATIONS_DESCRIPTION: 'Manage your organizations and memberships.',
  // ORGANIZATIONS_INSTRUCTIONS: 'Create an organization to collaborate with other users.',
  // CREATE_ORGANIZATION: 'Create Organization',
  // ORGANIZATION_NAME: 'Name',
  // ORGANIZATION_NAME_PLACEHOLDER: 'Acme Inc.',
  // ORGANIZATION_NAME_DESCRIPTION: "This is your organization's visible name.",
  // ORGANIZATION_NAME_INSTRUCTIONS: 'Please use 32 characters at maximum.',
  // ORGANIZATION_SLUG: 'Slug URL',
  // ORGANIZATION_SLUG_DESCRIPTION: "This is your organization's URL namespace.",
  // ORGANIZATION_SLUG_INSTRUCTIONS: 'Please use 48 characters at maximum.',
  // ORGANIZATION_SLUG_PLACEHOLDER: 'acme-inc',
  // SLUG_REQUIRED: 'Organization slug is required',
  // SLUG_DOES_NOT_MATCH: 'The slug does not match',
  // CREATE_ORGANIZATION_SUCCESS: 'Organization created successfully',
  // LEAVE_ORGANIZATION: 'Leave Organization',
  // LEAVE_ORGANIZATION_CONFIRM: 'Are you sure you want to leave this organization?',
  // LEAVE_ORGANIZATION_SUCCESS: 'You have successfully left the organization.',
  // MANAGE_ORGANIZATION: 'Manage Organization',
  // DELETE_ORGANIZATION: 'Delete Organization',
  // DELETE_ORGANIZATION_DESCRIPTION: 'Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution.',
  // DELETE_ORGANIZATION_SUCCESS: 'Organization deleted successfully',
  // DELETE_ORGANIZATION_INSTRUCTIONS: 'Enter the organization slug to continue:',
};

// Member management strings
export const MEMBER_STRINGS = {
  // MEMBERS: 'Members',
  // MEMBERS_DESCRIPTION: 'Add or remove members and manage their roles.',
  // MEMBERS_INSTRUCTIONS: 'Invite new members to your organization.',
  // REMOVE_MEMBER: 'Remove Member',
  // REMOVE_MEMBER_CONFIRM: 'Are you sure you want to remove this member from the organization?',
  // REMOVE_MEMBER_SUCCESS: 'Member removed successfully',
  // INVITE_MEMBER: 'Invite Member',
  // INVITE_MEMBER_DESCRIPTION: 'Send an invitation to add a new member to your organization.',
  // SEND_INVITATION: 'Send Invitation',
  // SEND_INVITATION_SUCCESS: 'Invitation sent successfully',
  // PENDING_INVITATIONS: 'Pending Invitations',
  // PENDING_INVITATIONS_DESCRIPTION: 'Manage pending invitations to your organization.',
  // PENDING_USER_INVITATIONS_DESCRIPTION: "Invitations you've received from organizations.",
  // CANCEL_INVITATION: 'Cancel Invitation',
  // INVITATION_CANCELLED: 'Invitation cancelled successfully',
  // ACCEPT_INVITATION: 'Accept Invitation',
  // ACCEPT_INVITATION_DESCRIPTION: 'You have been invited to join an organization.',
  // INVITATION_ACCEPTED: 'Invitation accepted successfully',
  // INVITATION_REJECTED: 'Invitation rejected successfully',
  // INVITATION_EXPIRED: 'This invitation has expired',
};
