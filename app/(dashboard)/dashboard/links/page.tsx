import React from 'react';
import { LinkClient } from './components/client';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Separator } from '@/components/ui/separator';
import UserProfilePage from './components/User-Profile';
import { LinkColumn, UserProfileLinkProps } from '@/types/types';

const LinkPage = async () => {

  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user.id
    },
    include: {
      links: true,
      Click: true
    }
  });

  const formattedUser:UserProfileLinkProps = {
    name: user?.name ?? null,
    username: user?.username ?? null,
    bio: user?.bio ?? null,
    userImage: user?.image ?? null,
    links: user?.links ?? [],
  };

  const formattedLinks: LinkColumn[] = (user?.links ?? []).map((link) => ({
    id: link.id,
    userId: user?.id ?? "unknown",
    name: user?.name ?? null,
    username: user?.username ?? null,
    userImage: user?.image ?? null,
    title: link.title,
    platform: link.platform ?? null,
    linkImage: link.linkImage ?? null,
    gifImage: link.gifImage ?? null,
    url: link.url,
    order: link.order ?? 0, 
    isVisible: link.isVisible ?? false, 
    createdAt: format(link.createdAt, 'MMMM do, yyyy'),
    clicks: user?.Click?.length ?? 0, 
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <LinkClient data={formattedLinks} />
        <Separator />
        <UserProfilePage user={formattedUser} />
      </div>
    </div>
  )
}

export default LinkPage;
