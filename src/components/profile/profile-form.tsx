'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { updateProfileAction } from '@/actions/profile.actions';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/navigation';

export function ProfileForm() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const { user, signOut } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [image, setImage] = useState(user?.image ?? '');
  const [isPending, startTransition] = useTransition();

  const { execute, isExecuting } = useAction(updateProfileAction, {
    onSuccess: () => {
      toast.success(t('updateSuccess'));
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? tCommon('error'));
    },
  });

  const loading = isPending || isExecuting;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={image || undefined}
              alt={name || user?.email || 'User'}
            />
            <AvatarFallback>{name?.[0] ?? 'U'}</AvatarFallback>
          </Avatar>
          <CardTitle>{t('title')}</CardTitle>
        </div>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() => {
            execute({ name, image: image || '' });
          });
        }}
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('userProfile')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailVerified')}</Label>
            <Input id="email" value={user?.email ?? ''} disabled />
            {user?.emailVerified && (
              <p className="text-muted-foreground text-xs">
                {t('emailReadOnly')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">{t('avatarUrl')}</Label>
            <Input
              id="avatar"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild type="button">
            <Link href="/">{t('backToHome')}</Link>
          </Button>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? tCommon('loading') : t('updateProfile')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => signOut()}
            >
              {tCommon('signOut')}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
