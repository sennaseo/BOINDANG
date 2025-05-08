'use client';

import BottomNavBar from "@/components/navigation/BottomNavBar";
import { DotsThreeVertical, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from 'next/image';

export default function MorePage() {
    return (
        <div className="flex flex-col mx-5 pt-15 pb-20 min-h-screen justify-between">
            <div className="flex flex-row justify-between items-center">
                <Image  
                    src="/assets/more/더보기.png" 
                    alt="더보기"
                    width={500}
                    height={300}
                    layout="responsive"
                />
                <DotsThreeVertical size={24} weight="bold" fill="#363636" />
            </div>
            
            <div className="relative my-auto">
                <h2 className="text-xl font-bold">안녕하세요 youmin님</h2>
                <p className="text-xl font-bold mt-1">오늘도 건강하게 드셨나요?</p>
                
                <div className="absolute right-0 bg-maincolor hover:bg-maincolor-100 hover:cursor-pointer transition-colors duration-300 text-white rounded-full px-2 py-7">
                    <div className="flex items-center">
                        <span className="text-lg font-extrabold">체험단</span>
                        <span className="ml-2 text-sm font-light">→</span>
                    </div>
                </div>
            </div>
            
            <div className="relative mt-auto">
                <div className="relative mt-auto border-2 w-2/3 border-gray-500 rounded-xl py-2 px-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs font-light">최근 분석한 식품</span>
                        <span className="text-xl font-semibold">초코초코케이크</span>
                    </div>
                    <div className="absolute right-0 mr-6 -top-6">
                        <Image 
                            src="/assets/more/말풍선.png" 
                            alt="말풍선"
                            width={500}
                            height={300}
                            layout="responsive"
                        />
                        <span className="absolute flex items-center justify-center text-center w-32 h-8 inset-0 text-xs font-semibold text-[#363636]">나의 분석 기록 더보기</span>
                    </div>
                    <List size={24} weight="bold" fill="#363636" />
                </div>
            </div>
            
            <div className="my-5 grid grid-cols-7 grid-rows-4 gap-5 items-end">
                <div className="bg-moreyellow h-full rounded-xl relative items-end p-3 col-span-2 row-start-1 row-end-4">
                    <span className="text-white absolute text-sm bottom-3 right-3 font-semibold z-10"># 탄수화물</span>
                    <motion.div
                    initial={{
                        height: "0%",
                    }}
                    animate={{
                        height: "80%",
                    }}
                    transition={{
                        duration: 2,
                        height: {
                            duration: 2,
                            type: "spring",
                            bounce: 0.5,
                        },
                    }}
                    className="absolute bottom-0 inset-x-0 bg-moreyellow-100 rounded-xl" layoutId="gradient-border" />
                </div>
                

                <div className="bg-morered h-25 mt-15 rounded-xl relative items-end p-3 col-span-3 row-start-1 row-span-2">
                    <span className="text-white absolute text-sm bottom-3 right-3 font-semibold z-10"># 지방</span>    
                    <motion.div
                    initial={{
                        width: "0%",
                    }}
                    animate={{
                        width: "80%",
                    }}
                    transition={{   
                        duration: 2,
                        width: {
                            duration: 2,
                            type: "spring",
                            bounce: 0.5,
                        },
                    }}
                    className="absolute inset-y-0 right-0 bg-morered-100 rounded-xl" layoutId="gradient-border" />
                </div>

                <div className="bg-moregreen h-full rounded-xl relative items-end p-3 row-start-1 row-end-3 col-end-8 col-span-2">
                    <span className="text-white absolute text-sm bottom-3 right-3 font-semibold z-10"># 단백질</span>
                    <motion.div
                    initial={{
                        height: "0%",
                    }}
                    animate={{
                        height: "80%",
                    }}
                    transition={{
                        duration: 2,
                        height: {
                            duration: 2,
                            type: "spring",         
                            bounce: 0.5,
                        },
                    }}
                    className="absolute bottom-0 inset-x-0 bg-moregreen-100 rounded-xl" layoutId="gradient-border" />
                </div>
                
                <div className="relative bg-moreblue h-full w-full rounded-xl col-span-5 col-start-3 row-span-2 row-end-5">
                    <span className="text-white text-sm font-semibold absolute bottom-3 right-3 z-10"># 통합 이지수</span>
                    <motion.div
                    initial={{
                        width: "0%",
                    }}
                    animate={{
                        width: "50%",
                    }}
                    transition={{   
                        duration: 2,
                        width: {
                            duration: 2,
                            type: "spring",
                            bounce: 0.5,
                        },
                    }}
                    className="bg-moregray absolute bottom-0 right-0 h-full w-1/2 rounded-xl flex items-end justify-end p-3"/>
                </div>
            </div>
            <BottomNavBar />
        </div>
    )
}