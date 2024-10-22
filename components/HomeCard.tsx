import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

interface HomeCardprops {
    classes: string,
    img: string,
    title: string, description: string, handleClick: () => void;
}
const HomeCard = ({ classes, img, title, description, handleClick }: HomeCardprops) => {
    return (
        <div className={cn(' px-4 py-6 rounded-[14px] cursor-pointer flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] ', classes)} onClick={handleClick}>
            <div className="flex-center glassmorphism size-12 rounded-[10px]">
                <Image src={img} alt='meeting icon' height={27} width={27} />
            </div>
            <div className="flex flex-col gap-2">
                <h1 className='text-2xl font-bold '>{title}</h1>
                <p className='text-lg font-normal'>{description}</p>
            </div>
        </div>
    )
}

export default HomeCard