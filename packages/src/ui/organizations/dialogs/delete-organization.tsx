'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useListOrganizations } from '../../../hooks/use-list-organizations';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { Organization } from '../../../types/auth';
import type { DialogComponentProps } from '../../../types/ui';
import { DialogComponent, DialogFooterComponent } from '../../shared/components/dialog';
import { OrgView } from '../../shared/view';

export function DeleteOrganizationDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  organization,
  ...props
}: DialogComponentProps & { organization: Organization | null | undefined }) {
  const { account: accountOptions, authClient, navigate, toast } = useAuth();
  const { refetch: refetchOrganizations } = useListOrganizations();

  const localization = useLocalization(localizationProp);

  const formSchema = z.object({
    slug: z
      .string()
      .min(1, { error: localization.SLUG_REQUIRED! })
      .refine((val) => val === organization?.slug, {
        error: localization.SLUG_DOES_NOT_MATCH!,
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '',
    },
  });

  const { isSubmitting } = form.formState;
  const disableSubmit = isSubmitting || !form.formState.isValid;

  const deleteOrganization = async () => {
    try {
      await authClient.organization.delete({
        organizationId: organization?.id as string,
        fetchOptions: { throw: true },
      });

      await refetchOrganizations?.();

      toast({
        message: localization.DELETE_ORGANIZATION_SUCCESS!,
        icon: 'success',
      });

      navigate(`${accountOptions?.basePath}/${accountOptions?.viewPaths.ORGANIZATIONS}`);

      onOpenChange?.(false);
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.DELETE_ORGANIZATION}
      description={description || localization.DELETE_ORGANIZATION_DESCRIPTION}
      disableFooter={true}
      {...props}
    >
      <Card className={cn('mb-4 flex-row p-4', classNames?.cell)}>
        <OrgView localization={localization} organization={organization} />
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(deleteOrganization)}>
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn('font-normal', classNames?.label)}>
                  {localization.DELETE_ORGANIZATION_INSTRUCTIONS}{' '}
                  <span className="font-bold">{organization?.slug}</span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder={organization?.slug}
                    className={classNames?.input}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>

                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />

          <DialogFooterComponent
            classNames={classNames}
            localization={localization}
            onOpenChange={onOpenChange}
            cancelButton={true}
            cancelButtonDisabled={isSubmitting}
            button={
              <Button
                type="submit"
                variant="destructive"
                className={cn(
                  disableSubmit && 'pointer-events-auto! cursor-not-allowed',
                  classNames?.button,
                  classNames?.primaryButton,
                )}
                disabled={disableSubmit}
              >
                {isSubmitting && <Spinner />}
                {localization.DELETE_ORGANIZATION}
              </Button>
            }
          />
        </form>
      </Form>
    </DialogComponent>
  );
}
