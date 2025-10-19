'use client';

import { type ComponentProps, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Account } from 'better-auth';
import { Loader2 } from 'lucide-react';

import {
  Button,
  Card,
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
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useAuthHooks } from '@/hooks';
import type { AuthLocalization } from '@/lib/localization';
import { cn, getLocalizedError } from '@/lib/utils';
import { SettingsCard, type SettingsCardClassNames } from '../../shared/settings-card';
import { UserView } from '../../shared/user-view';

export interface DeleteAccountCardProps {
  className?: string;
  classNames?: SettingsCardClassNames;
  accounts?: Account[] | null;
  isPending?: boolean;
  localization?: AuthLocalization;
  skipHook?: boolean;
}

export function DeleteAccountCard({
  className,
  classNames,
  accounts,
  isPending,
  localization: localizationProp,
  skipHook,
}: DeleteAccountCardProps) {
  const { localization: localizationContext } = useAuth();
  const { useListAccounts } = useAuthHooks();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const [showDialog, setShowDialog] = useState(false);

  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data as unknown as Account[];
    isPending = result.isPending;
  }

  return (
    <div>
      <SettingsCard
        className={className}
        classNames={classNames}
        actionLabel={localization?.DELETE_ACCOUNT}
        description={localization?.DELETE_ACCOUNT_DESCRIPTION}
        isPending={isPending}
        title={localization?.DELETE_ACCOUNT}
        variant="destructive"
        action={() => setShowDialog(true)}
      />

      <DeleteAccountDialog
        classNames={classNames}
        accounts={accounts}
        localization={localization}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  );
}

export interface DeleteAccountDialogProps extends ComponentProps<typeof Dialog> {
  classNames?: SettingsCardClassNames;
  accounts?: Account[] | null;
  localization?: AuthLocalization;
}

export function DeleteAccountDialog({
  classNames,
  accounts,
  localization: localizationProp,
  onOpenChange,
  ...props
}: DeleteAccountDialogProps) {
  const {
    authClient,
    basePath,
    baseURL,
    deleteUser,
    freshAge,
    localization: localizationContext,
    navigate,
    toast,
    viewPaths,
  } = useAuth();
  const { useSession } = useAuthHooks();
  const { data: sessionData } = useSession();

  const localization = useMemo(
    () => ({ ...localizationContext, ...localizationProp }),
    [localizationContext, localizationProp],
  );

  const session = sessionData?.session;
  const user = sessionData?.user;

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
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent className={cn('sm:max-w-md', classNames?.dialog?.content)}>
        <DialogHeader className={classNames?.dialog?.header}>
          <DialogTitle className={cn('text-lg md:text-xl', classNames?.title)}>
            {localization?.DELETE_ACCOUNT}
          </DialogTitle>

          <DialogDescription className={cn('text-xs md:text-sm', classNames?.description)}>
            {isFresh ? localization?.DELETE_ACCOUNT_INSTRUCTIONS : localization?.SESSION_NOT_FRESH}
          </DialogDescription>
        </DialogHeader>

        <Card className={cn('my-2 flex-row p-4', classNames?.cell)}>
          <UserView user={user} localization={localization} />
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(deleteAccount)} className="grid gap-6">
            {credentialsLinked && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNames?.label}>{localization?.PASSWORD}</FormLabel>

                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        placeholder={localization?.PASSWORD_PLACEHOLDER}
                        type="password"
                        className={classNames?.input}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className={classNames?.error} />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className={classNames?.dialog?.footer}>
              <Button
                type="button"
                variant="secondary"
                className={cn(classNames?.button, classNames?.secondaryButton)}
                onClick={() => onOpenChange?.(false)}
              >
                {localization.CANCEL}
              </Button>

              <Button
                className={cn(classNames?.button, classNames?.destructiveButton)}
                disabled={isSubmitting}
                variant="destructive"
                type="submit"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isFresh ? localization?.DELETE_ACCOUNT : localization?.SIGN_OUT}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
