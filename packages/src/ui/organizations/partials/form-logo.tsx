'use client';

import { useRef, useState } from 'react';
import { Trash2Icon, UploadCloudIcon } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pelatform/ui/default';
import { useAuth, useAuthHooks, useOrganization } from '../../../hooks/index';
import { useLocalization } from '../../../hooks/private';
import { fileToBase64, resizeAndCropImage } from '../../../lib/images';
import { getLocalizedError } from '../../../lib/utils';
import type { CardComponentProps } from '../../../types/ui';
import { OrganizationLogo } from '../../shared/avatar';
import { CardComponent } from '../../shared/components/card';

export function OrganizationLogoCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { toast } = useAuth();
  const {
    data: organization,
    isPending: organizationPending,
    logo,
    refetch: refetchOrganization,
  } = useOrganization();
  const { useUpdateOrganization, useHasPermission } = useAuthHooks();
  const { mutateAsync: updateOrganization } = useUpdateOrganization();
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization?.id,
    permissions: {
      organization: ['update'],
    },
  });

  const localization = useLocalization(localizationProp);

  const isPending = organizationPending || permissionPending || !organization;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = async (file: File) => {
    if (!logo || !hasPermission?.success) return;

    setLoading(true);

    const resizedFile = await resizeAndCropImage(
      file,
      crypto.randomUUID(),
      logo.size,
      logo.extension,
    );

    let image: string | undefined | null;

    if (logo.upload) {
      image = await logo.upload(resizedFile);
    } else {
      image = await fileToBase64(resizedFile);
    }

    if (!image) {
      setLoading(false);
      return;
    }

    try {
      await updateOrganization({
        organizationId: organization?.id,
        data: { logo: image },
      });

      await refetchOrganization?.();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setLoading(false);
  };

  const handleDeleteLogo = async () => {
    if (!hasPermission?.success) return;

    setLoading(true);

    try {
      if (organization?.logo) {
        await logo?.delete?.(organization?.logo);
      }

      await updateOrganization({
        organizationId: organization?.id,
        data: { logo: '' },
      });

      await refetchOrganization?.();
    } catch (error) {
      toast({
        message: getLocalizedError({ error, localization }),
      });
    }

    setLoading(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <CardComponent
      className={className}
      classNames={{
        content: 'flex items-center justify-between',
        header: 'w-full',
        ...classNames,
      }}
      title={localization.LOGO}
      description={localization.LOGO_DESCRIPTION}
      instructions={localization.LOGO_INSTRUCTIONS}
      isPending={isPending}
      {...props}
    >
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
        disabled={loading || !hasPermission?.success}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-fit rounded-full"
            disabled={!hasPermission?.success}
          >
            <OrganizationLogo
              key={organization?.logo}
              className="size-16 lg:size-20"
              classNames={{
                fallback: 'text-xl lg:text-2xl',
                ...classNames?.avatar,
              }}
              isPending={isPending || loading}
              localization={localization}
              organization={organization}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuItem onClick={openFileDialog} disabled={loading || !hasPermission?.success}>
            <UploadCloudIcon />
            {localization.UPLOAD_LOGO}
          </DropdownMenuItem>
          {organization?.logo && (
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDeleteLogo}
              disabled={loading || !hasPermission?.success}
            >
              <Trash2Icon />
              {localization.DELETE_LOGO}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </CardComponent>
  );
}
