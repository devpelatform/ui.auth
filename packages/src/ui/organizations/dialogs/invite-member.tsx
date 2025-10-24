'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useOrganization } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useListInvitations } from '../../../hooks/use-list-invitations';
import { useListMembers } from '../../../hooks/use-list-members';
import { useSession } from '../../../hooks/use-session';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Organization } from '../../../types/auth';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent, DialogFooterComponent } from '../../shared/components/dialog';

export function InviteMemberDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  organization,
  ...props
}: DialogComponentProps & { organization: Organization | null | undefined }) {
  const { authClient, toast } = useAuth();
  const { roles } = useOrganization();
  const { data: sessionData } = useSession();
  const { data: listMembersData } = useListMembers({
    query: { organizationId: organization?.id },
  });
  const { refetch: refetchInvitations } = useListInvitations({
    query: { organizationId: organization?.id },
  });

  const localization = useLocalization(localizationProp);

  const members = listMembersData?.members;
  const membership = members?.find((m) => m.userId === sessionData?.user.id);

  const availableRoles = roles.filter(
    (role) => membership?.role === 'owner' || role.role !== 'owner',
  );

  const formSchema = z.object({
    email: z.email({
      error: localization.INVALID_EMAIL,
    }),
    role: z.string().min(1, {
      error: `${localization.ROLE} ${localization.IS_REQUIRED}`,
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const disableSubmit = isSubmitting || !form.formState.isValid;

  async function onSubmit({ email, role }: z.infer<typeof formSchema>) {
    try {
      const builtInRoles = ['owner', 'admin', 'member'] as const;

      await authClient.organization.inviteMember({
        email,
        role: role as (typeof builtInRoles)[number],
        organizationId: organization?.id as string,
        fetchOptions: { throw: true },
      });

      await refetchInvitations?.();

      onOpenChange?.(false);
      form.reset();

      toast({
        message: localization.SEND_INVITATION_SUCCESS,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.INVITE_MEMBER}
      description={description || localization.INVITE_MEMBER_DESCRIPTION}
      disableFooter={true}
      {...props}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>{localization.EMAIL}</FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    placeholder={localization.EMAIL_PLACEHOLDER}
                    className={classNames?.input}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>{localization.ROLE}</FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.role} value={role.role}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooterComponent
            className="mt-0!"
            classNames={classNames}
            localization={localization}
            onOpenChange={onOpenChange}
            cancelButton={true}
            cancelButtonDisabled={isSubmitting}
            button={
              <Button
                type="submit"
                className={cn(
                  disableSubmit && 'pointer-events-auto! cursor-not-allowed',
                  classNames?.button,
                  classNames?.primaryButton,
                )}
                disabled={disableSubmit}
              >
                {isSubmitting && <Spinner />}
                {localization.SEND_INVITATION}
              </Button>
            }
          />
        </form>
      </Form>
    </DialogComponent>
  );
}
