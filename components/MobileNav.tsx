"use client"
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { SidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'


const MobileNav = () => {
    const pathName = usePathname();
    return (
        <section className='w-full max-w-[264px]'>
            <Sheet>
                <SheetTrigger asChild>
                    <Image src='/icons/hamburger.svg' height={36} width={36} alt='hambirger icon' className='cursor-pointer sm:hidden' />
                </SheetTrigger>
                <SheetContent side='left' className="border-none bg-dark-1 text-white">
                    <Link href='/' className='flex items-center gap-1'>
                        <Image src='/icons/logo.svg' height={32} width={32} alt='Yoom Logo' className='max-sm:size-10' />

                        <p className='text-[26px] font-extrabold text-white '>zoom</p>
                    </Link>

                    <div className="flex flex-col justify-between h-[calc(100vh-72px)] overflow-y-auto">
                        <SheetClose asChild >
                            <section className='flex flex-col justify-between gap-6 pt-16 text-white'>
                                {SidebarLinks.map((link) => {
                                    const isActive = pathName === link.route || pathName.startsWith(`${link.route}/`)

                                    return (
                                        <SheetClose asChild key={link.label}>
                                            <Link href={link.route}
                                                key={link.label} className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60 ', { 'bg-blue-1': isActive })}>
                                                <Image src={link.imgUrl} alt={link.label} height={20} width={20} />
                                                <p className=" font-semibold ">{link.label}</p>
                                            </Link>
                                        </SheetClose>
                                    )
                                })}
                            </section>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>

        </section>
    )
}

export default MobileNav