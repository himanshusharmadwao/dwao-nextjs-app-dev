export const dynamic = 'force-dynamic';

import React, { memo } from 'react'
import ExtendLink from '../../ui/extendLink'
import Image from 'next/image'
import { getJoinTheTeam } from '@/libs/apis/data/home';
import { breakTitle } from '@/libs/utils';

const JoinTheTeam = async () => {

    const joinTheTeamResponse = await getJoinTheTeam();
    // console.log(joinTheTeamResponse);

    return (
        <div className="flex flex-col-reverse lg:flex-row lg:items-center">
            <div className="lg:basis-[50%] basis-full">
                <h2 className="lg:text-[3.2rem] text-[29px] text-con-dark leading-[1] mt-10 lg:mt-0">{breakTitle(joinTheTeamResponse.data[0].title)}</h2>
                <ExtendLink title={joinTheTeamResponse.data[0].linkTitle} href={joinTheTeamResponse.data[0].linkHref} />
            </div>
            <div className="lg:basis-[50%] basis-full">
                <div className="lg:w-auto w-[350px] lg:inline inline-block">
                    <Image
                        src={joinTheTeamResponse.data[0].image.url}
                        alt="Card Image"
                        width={394}
                        height={293}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(JoinTheTeam)