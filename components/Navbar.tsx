import { NavLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AuthProviders from './AuthProviders'

const Navbar = () => {
    const session = {};

    return (
        <nav className='flexBetween navbar'>
            <div className='flex-1 flexStart gap-10'>
                <Link href={"/"}>
                    <Image
                        src="/logo.svg"
                        width={115}
                        height={43}
                        alt='Ripple'
                    />
                </Link>
                <ul className='xl:flex hidden text-sm gap-7'>
                    {NavLinks.map((link, index) => (
                        <Link href={link.href} key={link.key}>
                            {link.text}
                        </Link>
                    ))}
                </ul>
            </div>
            <div className='flexCenter gap-4'>
                {session ? (
                    <>
                        UserPhoto
                        <Link href={"/createproject"}>
                            Share your work
                        </Link>
                    </>
                    ) : (
                    <>
                        <AuthProviders />
                    </>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar