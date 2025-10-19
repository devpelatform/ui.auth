'use client';

import { type ComponentProps, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useAuth } from '@/hooks';
import { useLang } from '@/hooks/private';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import type { Refetch } from '@/types/generals';
import type { SettingsCardClassNames } from '../shared/settings-card';

export interface CreateApiKeyDialogProps extends ComponentProps<typeof Dialog> {
  classNames?: SettingsCardClassNames;
  localization?: AuthLocalization;
  onSuccess: (key: string) => void;
  refetch?: Refetch;
}

export function CreateApiKeyDialog({
  classNames,
  localization: localizationProp,
  onSuccess,
  refetch,
  onOpenChange,
  ...props
}: CreateApiKeyDialogProps) {
  const { authClient, apiKey, localization: localizationContext, toast } = useAuth();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

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

      const result = await authClient.apiKey.create({
        name: values.name,
        expiresIn,
        prefix: typeof apiKey === 'object' ? apiKey.prefix : undefined,
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
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={classNames?.dialog?.content}
      >
        <DialogHeader className={classNames?.dialog?.header}>
          <DialogTitle className={cn('text-lg md:text-xl', classNames?.title)}>
            {localization.CREATE_API_KEY}
          </DialogTitle>

          <DialogDescription className={cn('text-xs md:text-sm', classNames?.description)}>
            {localization.CREATE_API_KEY_DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
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

            <DialogFooter className={classNames?.dialog?.footer}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                className={cn(classNames?.button, classNames?.outlineButton)}
                disabled={isSubmitting}
              >
                {localization.CANCEL}
              </Button>

              <Button
                type="submit"
                className={cn(classNames?.button, classNames?.primaryButton)}
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner />}

                {localization.CREATE_API_KEY}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
