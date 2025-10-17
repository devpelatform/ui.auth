import { checkout, polar, portal, usage, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import type { BetterAuthOptions } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  anonymous,
  apiKey,
  captcha,
  deviceAuthorization,
  emailOTP,
  haveIBeenPwned,
  lastLoginMethod,
  magicLink,
  multiSession,
  oneTap,
  openAPI,
  organization,
  phoneNumber,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

import { config } from '@repo/config';
import { createEmailLog } from '@repo/db';
import { sendEmail } from '@repo/mail';
import { getLocaleFromRequest, isDevelopment, isProduction } from '../lib/utils';

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: isProduction ? 'production' : 'sandbox',
});

const pluginList = {
  plugins: [
    // Authentication
    anonymous(),
    emailOTP({
      // otpLength: 6,
      // expiresIn: 60 * 5, // 5 minutes
      async sendVerificationOTP({ email, otp: code, type }, request) {
        const locale = getLocaleFromRequest(request);
        const templateId = 'emailOtp';

        const name = email;
        const expiresIn = locale === 'id' ? '5 menit' : '5 minutes';

        const sending = await sendEmail({
          locale,
          templateId,
          to: email,
          context: {
            name,
            code,
            expiresIn,
          },
        });

        const metadata = {
          messageId: sending.success ? sending.messageId : undefined,
          error: !sending.success ? sending.error : undefined,
          locale,
          templateId,
          type,
          code,
          email,
          name,
          expiresIn,
        };

        if (isDevelopment) {
          console.info('Sending email', metadata);
        }

        if (config.email.databaseLog) {
          await createEmailLog({ email, metadata });
        }
      },
    }),
    magicLink({
      disableSignUp: !config.auth.signup,
      sendMagicLink: async ({ email, url, token }, request) => {
        const locale = getLocaleFromRequest(request);
        const templateId = 'magicLink';

        const name = email;
        const expiresIn = locale === 'id' ? '5 menit' : '5 minutes';

        const sending = await sendEmail({
          locale,
          templateId,
          to: email,
          context: {
            name,
            url,
            expiresIn,
          },
        });

        const metadata = {
          messageId: sending.success ? sending.messageId : undefined,
          error: !sending.success ? sending.error : undefined,
          locale,
          templateId,
          token,
          url,
          email,
          name,
          expiresIn,
        };

        if (isDevelopment) {
          console.info('Sending email', metadata);
        }

        if (config.email.databaseLog) {
          await createEmailLog({ email, metadata });
        }
      },
    }),
    oneTap(),
    passkey(),
    phoneNumber(),
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp: code }, request) => {
          const locale = getLocaleFromRequest(request);
          const templateId = 'emailOtp';

          const userId = user.id;
          const email = user.email;
          const name = user.name || email;
          const expiresIn = locale === 'id' ? '5 menit' : '5 minutes';

          const sending = await sendEmail({
            locale,
            templateId,
            to: email,
            context: {
              name,
              code,
              expiresIn,
            },
          });

          const metadata = {
            messageId: sending.success ? sending.messageId : undefined,
            error: !sending.success ? sending.error : undefined,
            locale,
            templateId,
            code,
            userId,
            email,
            name,
            expiresIn,
          };

          if (isDevelopment) {
            console.info('Sending email', metadata);
          }

          if (config.email.databaseLog) {
            await createEmailLog({ email, metadata });
          }
        },
      },
    }),
    username({
      minUsernameLength: 5,
    }),

    // Authorization
    admin({
      // adminUserIds: ["user_id_1", "user_id_2"]
      defaultBanReason: 'Spamming',
      defaultBanExpiresIn: 60 * 60 * 24,
      // ac,
      // roles: {
      //   admin: adminRole,
      //   user: userRole,
      //   client: clientRole,
      // },
    }),
    apiKey({
      enableMetadata: true,
    }),
    organization({
      schema: {
        organization: {
          modelName: 'organization',
          additionalFields: {
            ownerId: {
              type: 'string',
              input: false,
              required: false,
            },
            customerId: {
              type: 'string',
              input: false,
              required: false,
            },
            status: {
              type: 'string',
              input: false,
              required: true,
              defaultValue: 'ACTIVE',
            },
            description: {
              type: 'string',
              input: true,
              required: false,
            },
            domain: {
              type: 'string',
              input: true,
              required: false,
            },
            subdomain: {
              type: 'string',
              input: true,
              required: false,
            },
            timezone: {
              type: 'string',
              input: true,
              required: false,
              defaultValue: 'Asia/Jakarta',
            },
            referredBy: {
              type: 'string',
              input: false,
              required: false,
            },
            isTrashed: {
              type: 'boolean',
              input: false,
              required: false,
              defaultValue: false,
            },
            isProtected: {
              type: 'boolean',
              input: false,
              required: false,
              defaultValue: false,
            },
            deletedAt: {
              type: 'date',
              input: false,
              required: false,
            },
          },
        },
      },
      requireEmailVerificationOnInvitation: true,
      sendInvitationEmail: async (data, request) => {
        const locale = getLocaleFromRequest(request);
        const templateId = 'workspaceInvitation';

        const acceptUrl = new URL(config.path.workspaces.ACCEPT_INVITATION, config.appUrl);
        acceptUrl.searchParams.set('invitationId', data.id);

        const url = acceptUrl.toString();
        const email = data.email;
        const name = email;
        const expiresIn = locale === 'id' ? '2 hari' : '2 days';

        const sending = await sendEmail({
          to: email,
          templateId,
          locale,
          context: {
            name,
            url,
            expiresIn,
            workspaceName: data.organization.name,
            inviterName: data.inviter.user.name,
          },
        });

        const metadata = {
          messageId: sending.success ? sending.messageId : undefined,
          error: !sending.success ? sending.error : undefined,
          locale,
          templateId,
          url,
          email,
          name,
          expiresIn,
          workspaceName: data.organization.name,
          inviterName: data.inviter.user.name,
          inviterEmail: data.inviter.user.email,
        };

        if (isDevelopment) {
          console.info('Sending email', metadata);
        }

        if (config.email.databaseLog) {
          await createEmailLog({ email, metadata });
        }
      },
      // allowUserToCreateOrganization: async (user) => {
      //   const subscription = await getSubscription(user.id);
      //   return subscription.plan === "pro";
      // },
      organizationHooks: {
        // Before/after organization creation hooks
        beforeCreateOrganization: async ({ organization, user }) => {
          return {
            data: {
              ...organization,
              ownerId: user.id,
              // metadata: {
              //   customField: "value",
              // },
            },
          };
        },
        // afterCreateOrganization: async ({ organization, member, user }) => {
        //   // Run custom logic after organization is created
        //   // e.g., create default resources, send notifications
        //   await setupDefaultResources(organization.id);
        // },

        // Before/after Organization update hooks
        // beforeUpdateOrganization: async ({ organization, user, member }) => {
        //   // Validate updates, apply business rules
        //   return {
        //     data: {
        //       ...organization,
        //       name: organization.name?.toLowerCase(),
        //     },
        //   };
        // },
        // afterUpdateOrganization: async ({ organization, user, member }) => {
        //   // Sync changes to external systems
        //   await syncOrganizationToExternalSystems(organization);
        // },

        // Before/after a member is added to an organization
        // beforeAddMember: async ({ member, user, organization }) => {
        //   // Custom validation or modification
        //   console.log(`Adding ${user.email} to ${organization.name}`);

        //   // Optionally modify member data
        //   return {
        //     data: {
        //       ...member,
        //       role: "custom-role", // Override the role
        //     },
        //   };
        // },
        // afterAddMember: async ({ member, user, organization }) => {
        //   // Send welcome email, create default resources, etc.
        //   await sendWelcomeEmail(user.email, organization.name);
        // },

        // Before/after a member is removed
        // beforeRemoveMember: async ({ member, user, organization }) => {
        //   // Cleanup user's resources, send notification, etc.
        //   await cleanupUserResources(user.id, organization.id);
        // },
        // afterRemoveMember: async ({ member, user, organization }) => {
        //   await logMemberRemoval(user.id, organization.id);
        // },

        // Before/after updating a member's role
        // beforeUpdateMemberRole: async ({
        //   member,
        //   newRole,
        //   user,
        //   organization,
        // }) => {
        //   // Validate role change permissions
        //   if (newRole === "owner" && !hasOwnerUpgradePermission(user)) {
        //     throw new Error("Cannot upgrade to owner role");
        //   }

        //   // Optionally modify the role
        //   return {
        //     data: {
        //       role: newRole,
        //     },
        //   };
        // },
        // afterUpdateMemberRole: async ({
        //   member,
        //   previousRole,
        //   user,
        //   organization,
        // }) => {
        //   await logRoleChange(user.id, previousRole, member.role);
        // },

        // Before/after creating an invitation
        // beforeCreateInvitation: async ({
        //   invitation,
        //   inviter,
        //   organization,
        // }) => {
        //   // Custom validation or expiration logic
        //   const customExpiration = new Date(
        //     Date.now() + 1000 * 60 * 60 * 24 * 7
        //   ); // 7 days

        //   return {
        //     data: {
        //       ...invitation,
        //       expiresAt: customExpiration,
        //     },
        //   };
        // },
        // afterCreateInvitation: async ({
        //   invitation,
        //   inviter,
        //   organization,
        // }) => {
        //   // Send custom invitation email, track metrics, etc.
        //   await sendCustomInvitationEmail(invitation, organization);
        // },

        // Before/after accepting an invitation
        // beforeAcceptInvitation: async ({ invitation, user, organization }) => {
        //   // Additional validation before acceptance
        //   await validateUserEligibility(user, organization);
        // },
        // afterAcceptInvitation: async ({
        //   invitation,
        //   member,
        //   user,
        //   organization,
        // }) => {
        //   // Setup user account, assign default resources
        //   await setupNewMemberResources(user, organization);
        // },

        // Before/after rejecting invitations
        // beforeRejectInvitation: async ({ invitation, user, organization }) => {
        //   // Log rejection reason, send notification to inviter
        // },
        // afterRejectInvitation: async ({ invitation, user, organization }) => {
        //   await notifyInviterOfRejection(invitation.inviterId, user.email);
        // },

        // Before/after cancelling invitations
        // beforeCancelInvitation: async ({
        //   invitation,
        //   cancelledBy,
        //   organization,
        // }) => {
        //   // Verify cancellation permissions
        // },
        // afterCancelInvitation: async ({
        //   invitation,
        //   cancelledBy,
        //   organization,
        // }) => {
        //   await logInvitationCancellation(invitation.id, cancelledBy.id);
        // },
      },
    }),

    // Utility
    captcha({
      provider: 'cloudflare-turnstile', // or google-recaptcha, hcaptcha
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
    deviceAuthorization({
      // expiresIn: "30m", // Device code expiration time
      // interval: "5s",    // Minimum polling interval
    }),
    haveIBeenPwned(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    multiSession(),
    openAPI(),

    // 3rd party
    nextCookies(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: isProduction,
      authenticatedUsersOnly: true,
      use: [
        portal(),
        usage(),
        checkout({
          products: [
            {
              productId: process.env.POLAR_HOBBY_PRODUCT_ID || '',
              slug: 'hobby',
            },
            {
              productId: process.env.POLAR_PRO_PRODUCT_ID || '',
              slug: 'pro',
            },
            {
              productId: process.env.POLAR_TEAM_PRODUCT_ID || '',
              slug: 'team',
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || '',
        }),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET || '',
          // onCustomerCreated: async (payload) => {
          //   await handleCustomerCreated(payload);
          // },
          // onSubscriptionCreated: async (payload) => {
          //   await handleSubscriptionCreated(payload);
          // },
          // onSubscriptionUpdated: async (payload) => {
          //   await handleSubscriptionUpdated(payload);
          // },
          // onSubscriptionCanceled: async (payload) => {
          //   await handleSubscriptionCanceled(payload);
          // },
          // onSubscriptionRevoked: async (payload) => {
          //   await handleSubscriptionRevoked(payload);
          // },
        }),
      ],
    }),
  ],
} satisfies BetterAuthOptions;

export const plugins = {
  plugins: [
    ...(pluginList.plugins ?? []),
    // customSession(
    //   async ({ user, session }, ctx) => {
    //     const exp = Math.floor(
    //       new Date(session.expiresAt as any).getTime() / 1000,
    //     );
    //     const payload = {
    //       sub: user.id,
    //       email: user.email,
    //       aud: 'authenticated',
    //       role: 'authenticated',
    //       exp,
    //     };
    //     const supabaseToken = await signSupabaseJWT(payload);
    //     return {
    //       user,
    //       session,
    //       supabaseToken,
    //     };
    //   },
    //   pluginOptions,
    //   { shouldMutateListDeviceSessionsEndpoint: true },
    // ),
  ],
} satisfies BetterAuthOptions;
