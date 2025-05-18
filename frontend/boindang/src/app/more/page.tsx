'use client';

import { useState, useEffect, useRef } from 'react';
import BottomNavBar from "@/components/navigation/BottomNavBar";
import { DotsThreeVertical, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { getUserInfo } from "@/api/auth";
import type { SignUpResult } from "@/types/api/authTypes";
import { usePreventSwipeBack } from '@/hooks/usePreventSwipeBack';

export default function MorePage() {
    const [result, setUserInfo] = useState<SignUpResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const morePageContainerRef = useRef<HTMLDivElement>(null);

    usePreventSwipeBack(morePageContainerRef, { edgeThreshold: 30 });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const result = await getUserInfo();
                console.log(result);
                if (result) {
                    setUserInfo(result);
                } else {
                    setError("사용자 정보를 불러오는데 실패했습니다.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.");
            }
            setLoading(false);
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return (
            <div ref={morePageContainerRef} className="flex flex-col mx-5 pt-15 pb-20 min-h-screen justify-center items-center">
                <p>로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div ref={morePageContainerRef} className="flex flex-col mx-5 pt-15 pb-20 min-h-screen justify-center items-center">
                <p>오류: {error}</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div ref={morePageContainerRef} className="flex flex-col mx-5 pt-15 pb-20 min-h-screen justify-center items-center">
                <p>사용자 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div ref={morePageContainerRef} className="flex flex-col mx-5 pt-15 pb-20 min-h-screen justify-between">
            <div className="flex flex-row justify-between items-center">
                <Image
                    src="/assets/more/더보기.png"
                    alt="더보기"
                    width={116}
                    height={38}
                />
                <DotsThreeVertical size={24} weight="bold" fill="#363636" />
            </div>

            <div className="relative my-auto text-[#363636]">
                <h2 className="text-xl font-bold">안녕하세요 {result.nickname}님</h2>
                <p className="text-xl font-bold mt-1">오늘도 건강하게 드셨나요?</p>
            </div>

            <div className="relative mt-auto">
                <div className="relative mt-auto border-2 w-2/3 border-[#363636] rounded-xl py-3 px-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#363636]">나의 분석 기록</span>
                    <div className="absolute right-0 mr-7 -top-6.5">
                        <Image
                            src="/assets/more/말풍선.png"
                            alt="말풍선"
                            width={132}
                            height={40}
                        />
                        <span className="absolute flex items-center justify-center text-center w-33 h-8 inset-0 text-xs font-semibold text-[#363636]">내가 분석한 식품 더보기</span>
                    </div>
                    <List size={24} weight="bold" fill="#363636" />
                </div>
            </div>

            <div className="my-5 grid grid-cols-7 grid-rows-4 gap-5 items-end cursor-pointer">
                <Link href="/more/experience" className="relative w-full h-full col-span-2 row-start-1 row-end-4">
                    <div className="bg-moreyellow h-full w-full rounded-xl relative items-end p-3 shadow-sm">
                        <span className="text-white absolute text-lg bottom-3 right-3 font-bold z-10">체험단</span>
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
                </Link>


                <Link href="/more/quiz" className="relative w-full h-full col-span-3 row-start-1 row-span-2">
                    <div className="bg-morered h-25 mt-15 rounded-xl relative items-end p-3 shadow-sm cursor-pointer">
                        <span className="text-white absolute text-lg bottom-3 right-3 font-bold z-10">내 퀴즈</span>
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
                </Link>

                <div className="bg-moregreen h-full rounded-xl relative items-end p-3 row-start-1 row-end-3 col-end-8 col-span-2 shadow-sm cursor-pointer">
                    <span className="text-white absolute text-lg bottom-3 right-3 font-bold z-10">타입 변경</span>
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

                <div className="relative bg-moreblue h-full w-full rounded-xl col-span-5 col-start-3 row-span-2 row-end-5 shadow-sm cursor-pointer">
                    <span className="text-white text-lg font-bold absolute bottom-3 right-3 z-10">내가 쓴 글/댓글</span>
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
                        className="bg-moregray absolute bottom-0 right-0 h-full w-1/2 rounded-xl flex items-end justify-end p-3" />
                </div>
            </div>
            <BottomNavBar />
        </div>
    )
}