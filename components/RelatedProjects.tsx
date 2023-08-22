import { ProjectInterface, UserProfile } from '@/common.types';
import { getUserProjects } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {
    userId:string;
    projectId:string;
}

const RelatedProjects = async ({userId, projectId} : Props) => {

    const result = await getUserProjects(userId) as {user? : UserProfile};

    console.log(result?.user?.projects?.edges)

    const filteredProjects = result?.user?.projects?.edges?.filter(({node}:{node : ProjectInterface})=>node?.id !== projectId
    )

    // console.log(filteredProjects);

    if(filteredProjects?.length === 0){
        console.log("lawda lassan")
        return null
    }
    
  return (
    <section className='flex flex-col mt-32 w-full'>
        <div className='flexBetween'>
            <p className='text-base font-bold'>More By {result?.user?.name}</p>
            <Link href={`/profile/${result?.user?.id}`} className='text-primary-purple text-base'>
                View all
            </Link>
        </div>
        <div className='related_projects-grid'>
            {filteredProjects?.map(({node}:{node:ProjectInterface})=>(
                <div className='flexCenter relateed_project-card drop-shadow-card'>
                    <Link href={`/project/${node?.id}`} className='flexCenter group relative w-full h-full'>
                        <Image 
                        src={node?.image}
                        width={414}
                        height={314}
                        alt='project cover'
                        className='rounded-2xl w-full h-full object-cover'
                        />
                        <div className='hidden group-hover:flex related_project-card_title'>
                            <p className='w-full'>{node?.title}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    </section>
  )
}

export default RelatedProjects