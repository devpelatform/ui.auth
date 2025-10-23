'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Skeleton,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useAuthHooks, useOrganization } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import type { CardComponentProps } from '@/types/ui';
import { CardComponent } from '../../shared/components/card';

export function OrganizationNameCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { toast } = useAuth();
  const { useHasPermission, useUpdateOrganization } = useAuthHooks();
  const {
    data: organization,
    isPending: organizationPending,
    refetch: refetchOrganization,
  } = useOrganization();
  const { mutate: updateOrganization } = useUpdateOrganization();
  const { data: hasPermission, isPending } = useHasPermission({
    organizationId: organization?.id,
    permissions: {
      organization: ['update'],
    },
  });

  const localization = useLocalization(localizationProp);

  const formSchema = z.object({
    name: z.string().min(1, {
      error: `${localization.ORGANIZATION_NAME} ${localization.IS_REQUIRED}`,
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: { name: organization?.name || '' },
  });

  const { isSubmitting } = form.formState;
  const disableSubmit = isSubmitting || !form.formState.isValid || !form.formState.isDirty;

  const updateOrganizationName = async ({ name }: z.infer<typeof formSchema>) => {
    if (organization?.name === name) {
      toast({
        message: `${localization.ORGANIZATION_NAME} ${localization.IS_THE_SAME}`,
      });

      return;
    }

    try {
      await updateOrganization({
        organizationId: organization?.id,
        data: { name },
      });

      await refetchOrganization?.();

      toast({
        message: `${localization.ORGANIZATION_NAME} ${localization.UPDATED_SUCCESSFULLY}`,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  if (organizationPending || !organization) {
    return (
      <CardComponent
        className={className}
        classNames={classNames}
        title={localization.ORGANIZATION_NAME}
        description={localization.ORGANIZATION_NAME_DESCRIPTION}
        instructions={localization.ORGANIZATION_NAME_INSTRUCTIONS}
        actionLabel={localization.SAVE}
        isPending={true}
        {...props}
      >
        <Skeleton className={cn('h-9 w-full', classNames?.skeleton)} />
      </CardComponent>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateOrganizationName)}>
        <CardComponent
          className={className}
          classNames={classNames}
          title={localization.ORGANIZATION_NAME}
          description={localization.ORGANIZATION_NAME_DESCRIPTION}
          instructions={localization.ORGANIZATION_NAME_INSTRUCTIONS}
          actionLabel={localization.SAVE}
          disabled={disableSubmit || !hasPermission?.success}
          isPending={isPending}
          {...props}
        >
          {isPending ? (
            <Skeleton className={cn('h-9 w-full', classNames?.skeleton)} />
          ) : (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={classNames?.input}
                      placeholder={localization.ORGANIZATION_NAME_PLACEHOLDER}
                      disabled={isSubmitting || !hasPermission?.success}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className={classNames?.error} />
                </FormItem>
              )}
            />
          )}
        </CardComponent>
      </form>
    </Form>
  );
}
