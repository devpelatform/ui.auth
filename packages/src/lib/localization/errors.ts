/* @private */

export const ERROR_CODES_LOCALIZATION = {
  // Base
  USER_NOT_FOUND: 'User not found',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_CREATE_SESSION: 'Failed to create session',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
  FAILED_TO_GET_SESSION: 'Failed to get session',
  INVALID_PASSWORD: 'Invalid password',
  INVALID_EMAIL: 'Invalid email',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Social account already linked',
  PROVIDER_NOT_FOUND: 'Provider not found',
  INVALID_TOKEN: 'Invalid token',
  ID_TOKEN_NOT_SUPPORTED: 'id_token not supported',
  FAILED_TO_GET_USER_INFO: 'Failed to get user info',
  USER_EMAIL_NOT_FOUND: 'User email not found',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  PASSWORD_TOO_SHORT: 'Password too short',
  PASSWORD_TOO_LONG: 'Password too long',
  USER_ALREADY_EXISTS: 'User already exists. Use another email.',
  EMAIL_CAN_NOT_BE_UPDATED: 'Email can not be updated',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Credential account not found',
  SESSION_EXPIRED: 'Session expired. Re-authenticate to perform this action.',
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: 'Account not found',
  USER_ALREADY_HAS_PASSWORD: 'User already has a password. Provide that to delete the account.',

  // Admin
  // FAILED_TO_CREATE_USER: "Failed to create user",
  // USER_ALREADY_EXISTS: "User already exists. Use another email.",
  YOU_CANNOT_BAN_YOURSELF: 'You cannot ban yourself',
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: 'You are not allowed to change users role',
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: 'You are not allowed to create users',
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: 'You are not allowed to list users',
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: 'You are not allowed to list users sessions',
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: 'You are not allowed to ban users',
  YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: 'You are not allowed to impersonate users',
  YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: 'You are not allowed to revoke users sessions',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: 'You are not allowed to delete users',
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: 'You are not allowed to set users password',
  BANNED_USER: 'You have been banned from this application',
  YOU_ARE_NOT_ALLOWED_TO_GET_USER: 'You are not allowed to get user',
  NO_DATA_TO_UPDATE: 'No data to update',
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: 'You are not allowed to update users',
  YOU_CANNOT_REMOVE_YOURSELF: 'You cannot remove yourself',

  // Anonymous
  // FAILED_TO_CREATE_USER: "Failed to create user",
  COULD_NOT_CREATE_SESSION: 'Could not create session',
  ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY:
    'Anonymous users cannot sign in again anonymously',

  // API Key
  INVALID_METADATA_TYPE: 'metadata must be an object or undefined',
  REFILL_AMOUNT_AND_INTERVAL_REQUIRED: 'refillAmount is required when refillInterval is provided',
  REFILL_INTERVAL_AND_AMOUNT_REQUIRED: 'refillInterval is required when refillAmount is provided',
  USER_BANNED: 'User is banned',
  UNAUTHORIZED_SESSION: 'Unauthorized or invalid session',
  KEY_NOT_FOUND: 'API Key not found',
  KEY_DISABLED: 'API Key is disabled',
  KEY_EXPIRED: 'API Key has expired',
  USAGE_EXCEEDED: 'API Key has reached its usage limit',
  KEY_NOT_RECOVERABLE: 'API Key is not recoverable',
  EXPIRES_IN_IS_TOO_SMALL: 'The expiresIn is smaller than the predefined minimum value.',
  EXPIRES_IN_IS_TOO_LARGE: 'The expiresIn is larger than the predefined maximum value.',
  INVALID_REMAINING: 'The remaining count is either too large or too small.',
  INVALID_PREFIX_LENGTH: 'The prefix length is either too large or too small.',
  INVALID_NAME_LENGTH: 'The name length is either too large or too small.',
  METADATA_DISABLED: 'Metadata is disabled.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded.',
  NO_VALUES_TO_UPDATE: 'No values to update.',
  KEY_DISABLED_EXPIRATION: 'Custom key expiration values are disabled.',
  INVALID_API_KEY: 'Invalid API key.',
  INVALID_USER_ID_FROM_API_KEY: 'The user id from the API key is invalid.',
  INVALID_API_KEY_GETTER_RETURN_TYPE:
    'API Key getter returned an invalid key type. Expected string.',
  SERVER_ONLY_PROPERTY:
    "The property you're trying to set can only be set from the server auth instance only.",
  FAILED_TO_UPDATE_API_KEY: 'Failed to update API key',
  NAME_REQUIRED: 'API Key name is required.',

  // Captcha
  VERIFICATION_FAILED: 'Captcha verification failed',
  MISSING_RESPONSE: 'Missing CAPTCHA response',
  UNKNOWN_ERROR: 'Something went wrong',
  MISSING_SECRET_KEY: 'Missing secret key',
  SERVICE_UNAVAILABLE: 'CAPTCHA service unavailable',

  // Email OTP
  OTP_EXPIRED: 'OTP expired',
  INVALID_OTP: 'Invalid OTP',
  // INVALID_EMAIL: "Invalid email",
  // USER_NOT_FOUND: "User not found",
  TOO_MANY_ATTEMPTS: 'Too many attempts',

  // Generic OAuth
  INVALID_OAUTH_CONFIGURATION: 'Invalid OAuth configuration',

  // HaveIBeenPwned
  PASSWORD_COMPROMISED:
    'The password you entered has been compromised. Please choose a different password.',

  // Multi Session
  INVALID_SESSION_TOKEN: 'Invalid session token',

  // Organization
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION:
    'You are not allowed to create a new organization',
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS:
    'You have reached the maximum number of organizations',
  ORGANIZATION_ALREADY_EXISTS: 'Organization already exists',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: 'User is not a member of the organization',
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION:
    'You are not allowed to update this organization',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION:
    'You are not allowed to delete this organization',
  NO_ACTIVE_ORGANIZATION: 'No active organization',
  USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: 'User is already a member of this organization',
  MEMBER_NOT_FOUND: 'Member not found',
  ROLE_NOT_FOUND: 'Role not found',
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: 'You are not allowed to create a new team',
  TEAM_ALREADY_EXISTS: 'Team already exists',
  TEAM_NOT_FOUND: 'Team not found',
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER:
    'You cannot leave the organization as the only owner',
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER:
    'You cannot leave the organization without an owner',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: 'You are not allowed to delete this member',
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION:
    'You are not allowed to invite users to this organization',
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: 'User is already invited to this organization',
  INVITATION_NOT_FOUND: 'Invitation not found',
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: 'You are not the recipient of the invitation',
  EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION:
    'Email verification required before accepting or rejecting invitation',
  YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: 'You are not allowed to cancel this invitation',
  INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION:
    'Inviter is no longer a member of the organization',
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE:
    'You are not allowed to invite a user with this role',
  FAILED_TO_RETRIEVE_INVITATION: 'Failed to retrieve invitation',
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: 'You have reached the maximum number of teams',
  UNABLE_TO_REMOVE_LAST_TEAM: 'Unable to remove last team',
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: 'You are not allowed to update this member',
  ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: 'Organization membership limit reached',
  YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION:
    'You are not allowed to create teams in this organization',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION:
    'You are not allowed to delete teams in this organization',
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: 'You are not allowed to update this team',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: 'You are not allowed to delete this team',
  INVITATION_LIMIT_REACHED: 'Invitation limit reached',
  TEAM_MEMBER_LIMIT_REACHED: 'Team member limit reached',
  USER_IS_NOT_A_MEMBER_OF_THE_TEAM: 'User is not a member of the team',
  YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM:
    'You are not allowed to list the members of this team',
  YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: 'You do not have an active team',
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: 'You are not allowed to create a new member',
  YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: 'You are not allowed to remove a team member',
  YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION:
    'You are not allowed to access this organization as an owner',
  YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: 'You are not a member of this organization',
  MISSING_AC_INSTANCE:
    'Dynamic Access Control requires a pre-defined ac instance on the server auth plugin. Read server logs for more information',
  YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE:
    'You must be in an organization to create a role',
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: 'You are not allowed to create a role',
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: 'You are not allowed to update a role',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: 'You are not allowed to delete a role',
  YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: 'You are not allowed to read a role',
  YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: 'You are not allowed to list a role',
  YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: 'You are not allowed to get a role',
  TOO_MANY_ROLES: 'This organization has too many roles',
  INVALID_RESOURCE: 'The provided permission includes an invalid resource',
  ROLE_NAME_IS_ALREADY_TAKEN: 'That role name is already taken',
  CANNOT_DELETE_A_PRE_DEFINED_ROLE: 'Cannot delete a pre-defined role',

  // Passkey
  CHALLENGE_NOT_FOUND: 'Challenge not found',
  YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: 'You are not allowed to register this passkey',
  FAILED_TO_VERIFY_REGISTRATION: 'Failed to verify registration',
  PASSKEY_NOT_FOUND: 'Passkey not found',
  AUTHENTICATION_FAILED: 'Authentication failed',
  UNABLE_TO_CREATE_SESSION: 'Unable to create session',
  FAILED_TO_UPDATE_PASSKEY: 'Failed to update passkey',

  // Phone Number
  INVALID_PHONE_NUMBER: 'Invalid phone number',
  PHONE_NUMBER_EXIST: 'Phone number already exists',
  INVALID_PHONE_NUMBER_OR_PASSWORD: 'Invalid phone number or password',
  UNEXPECTED_ERROR: 'Unexpected error',
  OTP_NOT_FOUND: 'OTP not found',
  // OTP_EXPIRED: "OTP expired",
  // INVALID_OTP: "Invalid OTP",
  PHONE_NUMBER_NOT_VERIFIED: 'Phone number not verified',

  // Subscription
  ALREADY_SUBSCRIBED_PLAN: "You're already subscribed to this plan",
  EMAIL_VERIFICATION_REQUIRED: 'Email verification is required before you can subscribe to a plan',
  FAILED_TO_FETCH_PLANS: 'Failed to fetch plans',
  SUBSCRIPTION_NOT_ACTIVE: 'Subscription is not active',
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found',
  SUBSCRIPTION_NOT_SCHEDULED_FOR_CANCELLATION: 'Subscription is not scheduled for cancellation',
  SUBSCRIPTION_PLAN_NOT_FOUND: 'Subscription plan not found',
  UNABLE_TO_CREATE_CUSTOMER: 'Unable to create customer',

  // Two Factor
  OTP_NOT_ENABLED: 'OTP not enabled',
  OTP_HAS_EXPIRED: 'OTP has expired',
  TOTP_NOT_ENABLED: 'TOTP not enabled',
  TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled",
  BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled",
  INVALID_BACKUP_CODE: 'Invalid backup code',
  INVALID_CODE: 'Invalid code',
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: 'Too many attempts. Please request a new code.',
  INVALID_TWO_FACTOR_COOKIE: 'Invalid two factor cookie',

  // Username
  INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password',
  // EMAIL_NOT_VERIFIED: "Email not verified",
  // UNEXPECTED_ERROR: "Unexpected error",
  USERNAME_IS_ALREADY_TAKEN: 'Username is already taken. Please try another.',
  USERNAME_TOO_SHORT: 'Username is too short',
  USERNAME_TOO_LONG: 'Username is too long',
  INVALID_USERNAME: 'Username is invalid',
  INVALID_DISPLAY_USERNAME: 'Display username is invalid',
};
