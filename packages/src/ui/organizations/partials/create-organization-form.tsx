'use client';

import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon, UploadCloudIcon } from 'lucide-react';
import slugify from 'slugify';

import {
  Button,
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
} from '@pelatform/ui/default';
import { useForm } from '@pelatform/ui/re/react-hook-form';
import * as z from '@pelatform/ui/re/zod';
import { useAuth, useOrganization } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { fileToBase64, resizeAndCropImage } from '../../../lib/images';
import { cn, getLocalizedError } from '../../../lib/utils';
import type { CardComponentProps } from '../../../types/ui';
import { OrganizationLogo } from '../../shared/avatar';
import { DialogFooterComponent } from '../../shared/components/dialog';

export function CreateOrganizationForm({
  classNames,
  localization: localizationProp,
  dialog = false,
  onOpenChange,
}: CardComponentProps & {
  dialog?: boolean;
  onOpenChange?: ((open: boolean) => void) | undefined;
}) {
  const { authClient, toast } = useAuth();
  const { logo: organizationLogo, setLastVisited } = useOrganization();

  const localization = useLocalization(localizationProp);

  const [logo, setLogo] = useState<string | null>(null);
  const [logoPending, setLogoPending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFileDialog = () => fileInputRef.current?.click();

  const formSchema = z.object({
    logo: z.string().optional(),
    name: z.string().min(1, {
      error: `${localization.ORGANIZATION_NAME} ${localization.IS_REQUIRED}`,
    }),
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
    defaultValues: {
      logo: '',
      name: '',
      slug: '',
    },
  });

  const watchedName = form.watch('name');
  const watchedSlug = form.watch('slug');

  const isSubmitting = form.formState.isSubmitting;
  const disableSubmit = isSubmitting || !form.formState.isValid || !watchedName || !watchedSlug;

  const handleLogoChange = async (file: File) => {
    if (!organizationLogo) return;

    setLogoPending(true);

    try {
      const resizedFile = await resizeAndCropImage(
        file,
        crypto.randomUUID(),
        organizationLogo.size,
        organizationLogo.extension,
      );

      // let image: string | undefined | null;
      // if (organizationLogo.upload) {
      //   image = await organizationLogo.upload(resizedFile);
      // } else {
      //   image = await fileToBase64(resizedFile);
      // }

      const image = await fileToBase64(resizedFile);

      setLogo(image || null);
      form.setValue('logo', image || '');
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setLogoPending(false);
  };

  const deleteLogo = async () => {
    setLogoPending(true);

    const currentUrl = logo || undefined;
    if (currentUrl && organizationLogo?.delete) {
      await organizationLogo.delete(currentUrl);
    }

    setLogo(null);
    form.setValue('logo', '');
    setLogoPending(false);
  };

  async function onSubmit({ name, slug, logo }: z.infer<typeof formSchema>) {
    try {
      const organization = await authClient.organization.create({
        name,
        slug,
        logo,
        fetchOptions: { throw: true },
      });

      setLastVisited({ organization, refetchList: true });

      onOpenChange?.(false);
      form.reset();
      setLogo(null);

      toast({
        message: localization.CREATE_ORGANIZATION_SUCCESS,
        icon: 'success',
      });
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }
  }

  const handleSlugify = (slug: string) => {
    return slugify(slug, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {organizationLogo && (
          <FormField
            control={form.control}
            name="logo"
            render={() => (
              <FormItem>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.item(0);
                    if (file) handleLogoChange(file);
                    e.target.value = '';
                  }}
                  disabled={logoPending}
                />

                <FormLabel>{localization.LOGO}</FormLabel>

                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="size-fit rounded-full"
                      >
                        <OrganizationLogo
                          className="size-16"
                          isPending={logoPending}
                          localization={localization}
                          organization={{
                            name: watchedName,
                            logo,
                          }}
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
                      <DropdownMenuItem onClick={openFileDialog} disabled={logoPending}>
                        <UploadCloudIcon />
                        {localization.UPLOAD_LOGO}
                      </DropdownMenuItem>

                      {logo && (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={deleteLogo}
                          disabled={logoPending}
                        >
                          <Trash2Icon />
                          {localization.DELETE_LOGO}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={openFileDialog}
                    disabled={logoPending}
                  >
                    {logoPending && <Spinner />}
                    {localization.UPLOAD}
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{localization.ORGANIZATION_NAME}</FormLabel>

              <FormControl>
                <Input
                  placeholder={localization.ORGANIZATION_NAME_PLACEHOLDER}
                  {...field}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v);
                    form.setValue('slug', handleSlugify(v), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  onBlur={() => {
                    field.onBlur();
                    void handleSlugify(form.getValues('slug'));
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{localization.ORGANIZATION_SLUG}</FormLabel>

              <FormControl>
                <Input placeholder={localization.ORGANIZATION_SLUG_PLACEHOLDER} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {dialog ? (
          <DialogFooterComponent
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
                {localization.CREATE_ORGANIZATION}
              </Button>
            }
          />
        ) : (
          <Button
            type="submit"
            className={cn(
              'w-full',
              disableSubmit && 'pointer-events-auto! cursor-not-allowed',
              classNames?.button,
              classNames?.primaryButton,
            )}
            disabled={disableSubmit}
          >
            {isSubmitting && <Spinner />}
            {localization.CREATE_ORGANIZATION}
          </Button>
        )}
      </form>
    </Form>
  );
}
