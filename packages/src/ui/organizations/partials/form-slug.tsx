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
import { useAuth, useAuthHooks, useOrganization } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Organization } from '../../../types/auth';
import type { CardComponentProps } from '../../../types/ui';
import { CardComponent } from '../../shared/components/card';

export function OrganizationSlugCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { toast, replace } = useAuth();
  const {
    basePath,
    data: organization,
    isPending: organizationPending,
    pathMode,
    refetch: refetchOrganization,
    setLastVisited,
    viewPaths,
  } = useOrganization();
  const { useUpdateOrganization, useHasPermission } = useAuthHooks();
  const { mutate: updateOrganization } = useUpdateOrganization();
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization?.id,
    permissions: {
      organization: ['update'],
    },
  });

  const localization = useLocalization(localizationProp);

  const isPending = organizationPending || permissionPending || !organization;

  const formSchema = z.object({
    slug: z
      .string()
      .min(1, {
        error: `${localization.ORGANIZATION_SLUG} ${localization.IS_REQUIRED}`,
      })
      .regex(/^[a-z0-9-]+$/, {
        error: `${localization.ORGANIZATION_SLUG} ${localization.IS_INVALID}`,
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: { slug: organization?.slug || '' },
  });

  const { isSubmitting } = form.formState;
  const disableSubmit = isSubmitting || !form.formState.isValid || !form.formState.isDirty;

  const updateOrganizationSlug = async ({ slug }: z.infer<typeof formSchema>) => {
    if (organization?.slug === slug) {
      toast({
        message: `${localization.ORGANIZATION_SLUG} ${localization.IS_THE_SAME}`,
      });

      return;
    }

    try {
      await updateOrganization({
        organizationId: organization?.id,
        data: { slug },
      });

      await refetchOrganization?.();

      toast({
        message: `${localization.ORGANIZATION_SLUG} ${localization.UPDATED_SUCCESSFULLY}`,
        icon: 'success',
      });

      // If using slug-based paths, redirect to the new slug's settings route
      if (pathMode === 'slug') {
        setLastVisited(organization as Organization);
        replace(`${basePath}/${slug}/${viewPaths.SETTINGS}`);
      }
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateOrganizationSlug)}>
        <CardComponent
          className={className}
          classNames={classNames}
          title={localization.ORGANIZATION_SLUG}
          description={localization.ORGANIZATION_SLUG_DESCRIPTION}
          instructions={localization.ORGANIZATION_SLUG_INSTRUCTIONS}
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={classNames?.input}
                      placeholder={localization.ORGANIZATION_SLUG_PLACEHOLDER}
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
