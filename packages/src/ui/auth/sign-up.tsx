'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon, UploadCloudIcon } from 'lucide-react';

import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
  Textarea,
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth } from '../../hooks/main';
import {
  useCaptcha,
  useIsHydrated,
  useLocalization,
  useOnSuccessTransition,
} from '../../hooks/private';
import { fileToBase64, resizeAndCropImage } from '../../lib/images';
import { cn, getLocalizedError, getPasswordSchema } from '../../lib/utils';
import type { BetterFetchOption } from '../../types/auth';
import { Captcha } from '../captcha/captcha';
import { UserAvatar } from '../shared/avatar';
import { PasswordInput } from '../shared/password-input';
import type { AuthFormProps } from './types';

export function SignUpForm({
  className,
  classNames,
  callbackURL,
  isSubmitting,
  localization: localizationProp,
  redirectTo: redirectToProp,
  setIsSubmitting,
  passwordValidation: passwordValidationProp,
}: AuthFormProps) {
  const {
    additionalFields,
    authClient,
    avatar,
    basePath,
    baseURL,
    credentials,
    nameRequired,
    navigate,
    persistClient,
    signUp: signUpOptions,
    viewPaths,
    toast,
  } = useAuth();

  const localization = useLocalization(localizationProp);
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha(localization);
  const isHydrated = useIsHydrated();
  const {
    onSuccess,
    isPending: transitionPending,
    redirectTo,
  } = useOnSuccessTransition(redirectToProp);

  const confirmPasswordEnabled = credentials?.confirmPassword;
  const usernameEnabled = credentials?.username;
  const passwordValidationContext = credentials?.passwordValidation;
  const signUpFields = signUpOptions?.fields;

  const passwordValidation = useMemo(
    () => ({ ...passwordValidationContext, ...passwordValidationProp }),
    [passwordValidationContext, passwordValidationProp],
  );

  // Avatar upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getCallbackURL = useCallback(
    () =>
      `${baseURL}${
        callbackURL ||
        (persistClient
          ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(redirectTo)}`
          : redirectTo)
      }`,
    [callbackURL, persistClient, basePath, viewPaths, baseURL, redirectTo],
  );

  // Create the base schema for standard fields
  const defaultFields = {
    email: z.email({
      error: `${localization.EMAIL} ${localization.IS_INVALID}`,
    }),
    password: getPasswordSchema(passwordValidation, localization),
    name:
      signUpFields?.includes('name') && nameRequired
        ? z.string().min(1, {
            error: `${localization.NAME} ${localization.IS_REQUIRED}`,
          })
        : z.string().optional(),
    image: z.string().optional(),
    username: usernameEnabled
      ? z.string().min(1, {
          error: `${localization.USERNAME} ${localization.IS_REQUIRED}`,
        })
      : z.string().optional(),
    confirmPassword: confirmPasswordEnabled
      ? getPasswordSchema(passwordValidation, {
          PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
          PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
          PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
          INVALID_PASSWORD: localization.INVALID_PASSWORD,
        })
      : z.string().optional(),
  };

  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Add additional fields from signUpFields
  if (signUpFields) {
    for (const field of signUpFields) {
      if (field === 'name') continue; // Already handled above
      if (field === 'image') continue; // Already handled above

      const additionalField = additionalFields?.[field];
      if (!additionalField) continue;

      let fieldSchema: z.ZodTypeAny;

      // Create the appropriate schema based on field type
      if (additionalField.type === 'number') {
        fieldSchema = additionalField.required
          ? z.preprocess(
              (val) => (!val ? undefined : Number(val)),
              z.number({
                error: `${additionalField.label} ${localization.IS_INVALID}`,
              }),
            )
          : z.coerce
              .number({
                error: `${additionalField.label} ${localization.IS_INVALID}`,
              })
              .optional();
      } else if (additionalField.type === 'boolean') {
        fieldSchema = additionalField.required
          ? z.coerce
              .boolean({
                error: `${additionalField.label} ${localization.IS_INVALID}`,
              })
              .refine((val) => val === true, {
                error: `${additionalField.label} ${localization.IS_REQUIRED}`,
              })
          : z.coerce
              .boolean({
                error: `${additionalField.label} ${localization.IS_INVALID}`,
              })
              .optional();
      } else {
        fieldSchema = additionalField.required
          ? z.string().min(1, {
              error: `${additionalField.label} ${localization.IS_REQUIRED}`,
            })
          : z.string().optional();
      }

      schemaFields[field] = fieldSchema;
    }
  }

  const formSchema = z
    .object(defaultFields)
    .extend(schemaFields)
    .refine(
      (data) => {
        // Skip validation if confirmPassword is not enabled
        if (!confirmPasswordEnabled) return true;
        return data.password === data.confirmPassword;
      },
      {
        message: localization.PASSWORDS_DO_NOT_MATCH!,
        path: ['confirmPassword'],
      },
    );

  // Create default values for the form
  const defaultValues: Record<string, unknown> = {
    email: '',
    password: '',
    ...(confirmPasswordEnabled && { confirmPassword: '' }),
    ...(signUpFields?.includes('name') ? { name: '' } : {}),
    ...(usernameEnabled ? { username: '' } : {}),
    ...(signUpFields?.includes('image') && avatar ? { image: '' } : {}),
  };

  // Add default values for additional fields
  if (signUpFields) {
    for (const field of signUpFields) {
      if (field === 'name') continue;
      if (field === 'image') continue;
      const additionalField = additionalFields?.[field];
      if (!additionalField) continue;

      defaultValues[field] = additionalField.type === 'boolean' ? false : '';
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;

  useEffect(() => {
    setIsSubmitting?.(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);

  const handleAvatarChange = async (file: File) => {
    if (!avatar) return;

    setUploadingAvatar(true);

    try {
      const resizedFile = await resizeAndCropImage(
        file,
        crypto.randomUUID(),
        avatar.size,
        avatar.extension,
      );

      let image: string | undefined | null;

      if (avatar.upload) {
        image = await avatar.upload(resizedFile);
      } else {
        image = await fileToBase64(resizedFile);
      }

      if (image) {
        setAvatarImage(image);
        form.setValue('image', image);
      } else {
        setAvatarImage(null);
        form.setValue('image', '');
      }
    } catch (error) {
      console.error(error);
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setUploadingAvatar(false);
  };

  const handleDeleteAvatar = () => {
    setAvatarImage(null);
    form.setValue('image', '');
  };

  const openFileDialog = () => fileInputRef.current?.click();

  async function signUp({
    email,
    password,
    name,
    username,
    _confirmPassword,
    image,
    ...additionalFieldValues
  }: z.infer<typeof formSchema>) {
    try {
      // Validate additional fields with custom validators if provided
      for (const [field, value] of Object.entries(additionalFieldValues)) {
        const additionalField = additionalFields?.[field];
        if (!additionalField?.validate) continue;

        if (typeof value === 'string' && !(await additionalField.validate(value))) {
          form.setError(field, {
            message: `${additionalField.label} ${localization.IS_INVALID}`,
          });
          return;
        }
      }

      const fetchOptions: BetterFetchOption = {
        throw: true,
        headers: await getCaptchaHeaders('/sign-up/email'),
      };

      const additionalParams: Record<string, unknown> = {};

      if (username !== undefined) {
        additionalParams.username = username;
      }

      if (image !== undefined) {
        additionalParams.image = image;
      }

      const data = await authClient.signUp.email({
        email: email as string,
        password: password as string,
        name: (name as string) || '',
        ...additionalParams,
        ...additionalFieldValues,
        callbackURL: getCallbackURL(),
        fetchOptions,
      });

      if ('token' in data && data.token) {
        await onSuccess();
      } else {
        navigate(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
        toast({
          message: localization.SIGN_UP_EMAIL!,
          icon: 'success',
        });
      }
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });

      form.resetField('password');
      form.resetField('confirmPassword');
      resetCaptcha();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(signUp)}
        className={cn('grid w-full gap-6', className, classNames?.base)}
        noValidate={isHydrated}
      >
        {signUpFields?.includes('image') && avatar && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              disabled={uploadingAvatar}
              onChange={(e) => {
                const file = e.target.files?.item(0);
                if (file) handleAvatarChange(file);
                e.target.value = '';
              }}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>{localization.AVATAR}</FormLabel>
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-fit rounded-full"
                        >
                          <UserAvatar
                            className="size-16"
                            isPending={uploadingAvatar}
                            localization={localization}
                            user={
                              avatarImage
                                ? {
                                    name: form.watch('name') as string,
                                    email: form.watch('email') as string,
                                    image: avatarImage,
                                  }
                                : null
                            }
                          />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        onCloseAutoFocus={(e) => e.preventDefault()}
                      >
                        <DropdownMenuItem onClick={openFileDialog} disabled={uploadingAvatar}>
                          <UploadCloudIcon />
                          {localization.UPLOAD_AVATAR}
                        </DropdownMenuItem>

                        {avatarImage && (
                          <DropdownMenuItem
                            onClick={handleDeleteAvatar}
                            disabled={uploadingAvatar}
                            variant="destructive"
                          >
                            <Trash2Icon />
                            {localization.DELETE_AVATAR}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={openFileDialog}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar && <Spinner />}
                      {localization.UPLOAD}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {signUpFields?.includes('name') && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>{localization.NAME}</FormLabel>

                <FormControl>
                  <Input
                    className={classNames?.input}
                    placeholder={localization.NAME_PLACEHOLDER}
                    disabled={isSubmitting}
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>

                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />
        )}

        {usernameEnabled && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>{localization.USERNAME}</FormLabel>

                <FormControl>
                  <Input
                    className={classNames?.input}
                    placeholder={localization.USERNAME_PLACEHOLDER}
                    disabled={isSubmitting}
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>

                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>{localization.EMAIL}</FormLabel>

              <FormControl>
                <Input
                  className={classNames?.input}
                  type="email"
                  placeholder={localization.EMAIL_PLACEHOLDER}
                  disabled={isSubmitting}
                  {...field}
                  value={field.value as string}
                />
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={classNames?.label}>{localization.PASSWORD}</FormLabel>

              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  className={classNames?.input}
                  placeholder={localization.PASSWORD_PLACEHOLDER}
                  disabled={isSubmitting}
                  enableToggle
                  {...field}
                  value={field.value as string}
                />
              </FormControl>

              <FormMessage className={classNames?.error} />
            </FormItem>
          )}
        />

        {confirmPasswordEnabled && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={classNames?.label}>{localization.CONFIRM_PASSWORD}</FormLabel>

                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    className={classNames?.input}
                    placeholder={localization.CONFIRM_PASSWORD_PLACEHOLDER}
                    disabled={isSubmitting}
                    enableToggle
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>

                <FormMessage className={classNames?.error} />
              </FormItem>
            )}
          />
        )}

        {signUpFields
          ?.filter((field) => field !== 'name' && field !== 'image')
          .map((field) => {
            const additionalField = additionalFields?.[field];
            if (!additionalField) {
              console.error(`Additional field ${field} not found`);
              return null;
            }
            return additionalField.type === 'boolean' ? (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: formField }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={formField.value as boolean}
                          onCheckedChange={formField.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormLabel className={classNames?.label}>{additionalField.label}</FormLabel>
                      <FormMessage className={classNames?.error} />
                    </div>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={classNames?.label}>{additionalField.label}</FormLabel>

                    <FormControl>
                      {additionalField.type === 'number' ? (
                        <Input
                          className={classNames?.input}
                          type="number"
                          placeholder={
                            additionalField.placeholder ||
                            (typeof additionalField.label === 'string' ? additionalField.label : '')
                          }
                          disabled={isSubmitting}
                          {...formField}
                          value={formField.value as number}
                        />
                      ) : additionalField.multiline ? (
                        <Textarea
                          className={classNames?.input}
                          placeholder={
                            additionalField.placeholder ||
                            (typeof additionalField.label === 'string' ? additionalField.label : '')
                          }
                          disabled={isSubmitting}
                          {...formField}
                          value={formField.value as string}
                        />
                      ) : (
                        <Input
                          className={classNames?.input}
                          type="text"
                          placeholder={
                            additionalField.placeholder ||
                            (typeof additionalField.label === 'string' ? additionalField.label : '')
                          }
                          disabled={isSubmitting}
                          {...formField}
                          value={formField.value as string}
                        />
                      )}
                    </FormControl>

                    <FormMessage className={classNames?.error} />
                  </FormItem>
                )}
              />
            );
          })}

        <Captcha ref={captchaRef} localization={localization} action="/sign-up/email" />

        <Button
          type="submit"
          className={cn('w-full', classNames?.button, classNames?.primaryButton)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : localization.SIGN_UP_ACTION}
        </Button>
      </form>
    </Form>
  );
}
