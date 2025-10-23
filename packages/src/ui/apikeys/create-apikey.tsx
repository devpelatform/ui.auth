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
import { useAuth } from '../../hooks/index';
import { useLang, useLocalization } from '../../hooks/private';
import { cn, getLocalizedError } from '../../lib/utils';
import type { Refetch } from '../../types/generals';
import type { DialogComponentProps } from '../../types/ui';
import { DialogComponent, DialogFooterComponent } from '../shared/components/dialog';

export function CreateApiKeyDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  onSuccess,
  refetch,
  isOrganization = false,
  organizationId,
  ...props
}: DialogComponentProps & {
  onSuccess: (key: string) => void;
  refetch?: Refetch;
  isOrganization?: boolean;
  organizationId?: string;
}) {
  const { authClient, apiKey, toast } = useAuth();

  const localization = useLocalization(localizationProp);
  const { lang } = useLang();

  const formSchema = z.object({
    name: z.string().min(1, { error: `${localization.NAME} ${localization.IS_REQUIRED}` }),
    expiresInDays: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    values: {
      name: '',
      expiresInDays: 'none',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const expiresIn =
        values.expiresInDays && values.expiresInDays !== 'none'
          ? Number.parseInt(values.expiresInDays) * 60 * 60 * 24
          : undefined;

      const metadata = { organizationId };

      const result = await authClient.apiKey.create({
        name: values.name,
        expiresIn,
        prefix: typeof apiKey === 'object' ? apiKey.prefix : undefined,
        metadata: isOrganization ? metadata : undefined,
        fetchOptions: { throw: true },
      });

      await refetch?.();
      onSuccess(result.key);
      onOpenChange?.(false);
      form.reset();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  };

  const rtf = new Intl.RelativeTimeFormat(lang ?? 'en');

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.CREATE_API_KEY}
      description={description || localization.CREATE_API_KEY_DESCRIPTION}
      disableFooter={true}
      {...props}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-4">
            {isOrganization && <input type="hidden" name="organizationId" value={organizationId} />}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={classNames?.label}>{localization.NAME}</FormLabel>

                  <FormControl>
                    <Input
                      className={classNames?.input}
                      placeholder={localization.API_KEY_NAME_PLACEHOLDER}
                      autoFocus
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={classNames?.label}>{localization.EXPIRES}</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className={classNames?.input}>
                        <SelectValue placeholder={localization.NO_EXPIRATION} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="none">{localization.NO_EXPIRATION}</SelectItem>
                      {[1, 7, 30, 60, 90, 180, 365].map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days === 365 ? rtf.format(1, 'year') : rtf.format(days, 'day')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooterComponent
            classNames={classNames}
            localization={localization}
            onOpenChange={onOpenChange}
            cancelButton={true}
            cancelButtonDisabled={isSubmitting}
            button={
              <Button
                type="submit"
                className={cn(classNames?.button, classNames?.primaryButton)}
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner />}
                {localization.CREATE_API_KEY}
              </Button>
            }
          />
        </form>
      </Form>
    </DialogComponent>
  );
}
