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
  Spinner,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useAuthHooks } from '@/hooks';
import { useLocalization } from '@/hooks/private';
import { cn, getLocalizedError } from '@/lib/utils';
import type { Account } from '@/types/auth';
import type { DialogComponentProps } from '@/types/ui';
import { DialogComponent, DialogFooterComponent } from '../../shared/components/dialog';
import { PasswordInput } from '../../shared/password-input';
import { UserView } from '../../shared/view';

export function DeleteAccountDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  title,
  description,
  accounts,
  ...props
}: DialogComponentProps & { accounts?: Account[] | null }) {
  const { authClient, basePath, baseURL, deleteUser, freshAge, navigate, toast, viewPaths } =
    useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const session = sessionData?.session;
  const user = sessionData?.user;

  const localization = useLocalization(localizationProp);

  const isFresh = session
    ? Date.now() - new Date(session?.createdAt).getTime() < freshAge * 1000
    : false;
  const credentialsLinked = accounts?.some((acc) => acc.providerId === 'credential');

  const formSchema = z.object({
    password: credentialsLinked
      ? z.string().min(1, { error: localization.PASSWORD_REQUIRED! })
      : z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  const deleteAccount = async ({ password }: z.infer<typeof formSchema>) => {
    const params = {} as Record<string, string>;

    if (credentialsLinked) {
      params.password = password!;
    } else if (!isFresh) {
      navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      return;
    }

    if (deleteUser?.verification) {
      params.callbackURL = `${baseURL}${basePath}/${viewPaths.SIGN_OUT}`;
    }

    try {
      await authClient.deleteUser({
        ...params,
        fetchOptions: {
          throw: true,
        },
      });

      if (deleteUser?.verification) {
        toast({
          message: localization.DELETE_ACCOUNT_VERIFY!,
          icon: 'success',
        });
      } else {
        toast({
          message: localization.DELETE_ACCOUNT_SUCCESS!,
          icon: 'success',
        });
        navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      }
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }

    onOpenChange?.(false);
  };

  return (
    <DialogComponent
      classNames={classNames}
      localization={localization}
      onOpenChange={onOpenChange}
      title={title || localization.DELETE_ACCOUNT}
      description={
        description || isFresh
          ? localization.DELETE_ACCOUNT_INSTRUCTIONS
          : localization.SESSION_NOT_FRESH
      }
      disableFooter={true}
      {...props}
    >
      <Card className={cn('mt-2 mb-5 flex-row p-4', classNames?.cell)}>
        <UserView localization={localization} user={user} />
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(deleteAccount)}>
          {credentialsLinked && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={classNames?.label}>{localization.PASSWORD}</FormLabel>

                  <FormControl>
                    <PasswordInput
                      className={classNames?.input}
                      placeholder={localization.PASSWORD_PLACEHOLDER}
                      autoComplete="current-password"
                      enableToggle
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className={classNames?.error} />
                </FormItem>
              )}
            />
          )}

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
                className={cn(classNames?.button, classNames?.destructiveButton)}
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner />}
                {isFresh ? localization.DELETE_ACCOUNT : localization.SIGN_OUT}
              </Button>
            }
          />
        </form>
      </Form>
    </DialogComponent>
  );
}
