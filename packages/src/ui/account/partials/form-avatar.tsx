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
import { useAuth } from '../../../hooks/main';
import { useLocalization } from '../../../hooks/private';
import { useSession } from '../../../hooks/use-session';
import { useUpdateUser } from '../../../hooks/use-update-user';
import { fileToBase64, resizeAndCropImage } from '../../../lib/images';
import { getLocalizedError } from '../../../lib/utils';
import type { CardComponentProps } from '../../../types/ui';
import { UserAvatar } from '../../shared/avatar';
import { CardComponent } from '../../shared/components/card';

export function FormAvatarCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}: CardComponentProps) {
  const { avatar, toast } = useAuth();
  const { data: sessionData, isPending, refetch: refetchSession } = useSession();
  const { mutate: updateUser } = useUpdateUser();

  const localization = useLocalization(localizationProp);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (file: File) => {
    if (!sessionData || !avatar) return;

    setLoading(true);
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

    if (!image) {
      setLoading(false);
      return;
    }

    if (!avatar.upload) setLoading(false);

    try {
      await updateUser({ image });
      await refetchSession?.();
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }

    setLoading(false);
  };

  const handleDeleteAvatar = async () => {
    if (!sessionData) return;

    setLoading(true);

    try {
      // If a custom storage remover is provided, attempt to clean up the old asset first
      if (sessionData.user.image && avatar?.delete) {
        await avatar.delete(sessionData.user.image);
      }

      await updateUser({ image: null });
      await refetchSession?.();
    } catch (error) {
      toast({ message: getLocalizedError({ error, localization }) });
    }

    setLoading(false);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <CardComponent
      className={className}
      classNames={{
        content: 'flex items-center justify-between',
        header: 'w-full',
        ...classNames,
      }}
      title={localization.AVATAR}
      description={localization.AVATAR_DESCRIPTION}
      instructions={localization.AVATAR_INSTRUCTIONS}
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
          if (file) handleAvatarChange(file);
          e.target.value = '';
        }}
        disabled={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-fit rounded-full">
            <UserAvatar
              key={sessionData?.user.image}
              className="size-16 lg:size-20"
              classNames={{
                fallback: 'text-xl lg:text-2xl',
                ...classNames?.avatar,
              }}
              isPending={isPending || loading}
              localization={localization}
              user={sessionData?.user}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuItem onClick={openFileDialog} disabled={loading}>
            <UploadCloudIcon />
            {localization.UPLOAD_AVATAR}
          </DropdownMenuItem>
          {sessionData?.user.image && (
            <DropdownMenuItem variant="destructive" onClick={handleDeleteAvatar} disabled={loading}>
              <Trash2Icon />
              {localization.DELETE_AVATAR}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </CardComponent>
  );
}
