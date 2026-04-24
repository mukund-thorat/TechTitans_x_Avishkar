import type { ReactNode } from 'react'
import {
  UserIcon,
  CreditCardIcon,
  LogOutIcon,
  CalendarDaysIcon
} from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from "@/api/authHooks";
import { Link } from 'react-router-dom'

type Props = {
  name: string
  avatar: string
  email: string
  trigger: ReactNode
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
}

const ProfileDropdown = ({ name, email, avatar, trigger, defaultOpen, align = 'end' }: Props) => {
  const logout = useLogoutMutation();

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align={align || 'end'}>
        <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
          <div className='relative'>
            <Avatar className='size-10'>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
          </div>
          <div className='flex flex-1 flex-col items-start overflow-hidden'>
            <span className='text-foreground text-lg font-semibold truncate w-full'>{name}</span>
            <span className='text-muted-foreground text-sm truncate w-full'>{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className='px-4 py-2.5 text-base'>
            <Link to='/profile'>
              <UserIcon className='text-foreground size-5' />
              <span>My account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className='px-4 py-2.5 text-base'>
            <Link to='/dashboard'>
              <CalendarDaysIcon className='text-foreground size-5' />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 mx-4" />
          <DropdownMenuItem className='px-4 py-2.5 text-base'>
            <CreditCardIcon className='text-foreground size-5' />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={() => logout.mutate()} 
          variant='destructive' 
          className='px-4 py-2.5 text-base cursor-pointer'
        >
          <LogOutIcon className='size-5' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
