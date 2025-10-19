'use client';

import { type ReactNode, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CardContent,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Skeleton,
  Textarea,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import type { FieldType } from '@/types/components';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';

export interface FormFieldCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  description?: ReactNode;
  instructions?: ReactNode;
  localization?: Partial<AuthLocalization>;
  name: string;
  placeholder?: string;
  required?: boolean;
  label?: ReactNode;
  type?: FieldType;
  multiline?: boolean;
  value?: unknown;
  validate?: (value: string) => boolean | Promise<boolean>;
}

export function FormFieldsCard({
  className,
  classNames,
  description,
  instructions,
  localization: localizationProp,
  name,
  placeholder,
  required,
  label,
  type,
  multiline,
  value,
  validate,
}: FormFieldCardProps) {
  const { localization: localizationContext, toast } = useAuth();
  const { useSession, useUpdateUser } = useAuthHooks();
  const { isPending } = useSession();
  const { mutate: updateUser } = useUpdateUser();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  let fieldSchema = z.unknown() as z.ZodType<unknown>;

  // Create the appropriate schema based on type
  if (type === 'number') {
    fieldSchema = required
      ? z.preprocess(
          (val) => (!val ? undefined : Number(val)),
          z.number({
            error: `${label} ${localization.IS_INVALID}`,
          }),
        )
      : z.coerce
          .number({
            error: `${label} ${localization.IS_INVALID}`,
          })
          .optional();
  } else if (type === 'boolean') {
    fieldSchema = required
      ? z.coerce
          .boolean({
            error: `${label} ${localization.IS_INVALID}`,
          })
          .refine((val) => val === true, {
            error: `${label} ${localization.IS_REQUIRED}`,
          })
      : z.coerce.boolean({
          error: `${label} ${localization.IS_INVALID}`,
        });
  } else {
    fieldSchema = required
      ? z.string().min(1, { error: `${label} ${localization.IS_REQUIRED}` })
      : z.string().optional();
  }

  const form = useForm({
    resolver: zodResolver(z.object({ [name]: fieldSchema })),
    values: { [name]: value || '' },
  });

  const { isSubmitting } = form.formState;

  const updateField = async (values: Record<string, unknown>) => {
    await new Promise((resolve) => setTimeout(resolve));
    const newValue = values[name];

    if (value === newValue) {
      toast({ message: `${label} ${localization.IS_THE_SAME}` });
      return;
    }

    if (validate && typeof newValue === 'string' && !(await validate(newValue))) {
      form.setError(name, {
        message: `${label} ${localization.IS_INVALID}`,
      });

      return;
    }

    try {
      await updateUser({ [name]: newValue });

      toast({
        message: `${label} ${localization.UPDATED_SUCCESSFULLY}`,
        icon: 'success',
      });
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateField)}>
        <SettingsCard
          className={className}
          classNames={classNames}
          description={description}
          instructions={instructions}
          isPending={isPending}
          title={label}
          actionLabel={localization.SAVE}
          optimistic={true}
        >
          <CardContent className={classNames?.content}>
            {type === 'boolean' ? (
              <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                        className={classNames?.checkbox}
                      />
                    </FormControl>

                    <FormLabel className={classNames?.label}>{label}</FormLabel>

                    <FormMessage className={classNames?.error} />
                  </FormItem>
                )}
              />
            ) : isPending ? (
              <Skeleton className={cn('h-9 w-full', classNames?.skeleton)} />
            ) : (
              <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {type === 'number' ? (
                        <Input
                          className={classNames?.input}
                          type="number"
                          placeholder={placeholder || (typeof label === 'string' ? label : '')}
                          disabled={isSubmitting}
                          {...field}
                          value={field.value as string}
                        />
                      ) : multiline ? (
                        <Textarea
                          className={classNames?.input}
                          placeholder={placeholder || (typeof label === 'string' ? label : '')}
                          disabled={isSubmitting}
                          {...field}
                          value={field.value as string}
                        />
                      ) : (
                        <Input
                          className={classNames?.input}
                          type="text"
                          placeholder={placeholder || (typeof label === 'string' ? label : '')}
                          disabled={isSubmitting}
                          {...field}
                          value={field.value as string}
                        />
                      )}
                    </FormControl>

                    <FormMessage className={classNames?.error} />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </SettingsCard>
      </form>
    </Form>
  );
}
