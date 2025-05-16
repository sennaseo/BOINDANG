'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import BottomNavBar from "@/components/navigation/BottomNavBar";
import { fetchMyApplications } from '@/api/more/experience';
import MyApplicationCard from '@/components/more/experience/MyApplicationCard';
import type { MyApplication } from '@/types/api/more/experience';

export default function ExperiencePage() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyApplications();
        setApplications(data);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col mx-5 pt-5 pb-20 min-h-screen">
      {/* 헤더 */}
      <div className="flex flex-row items-center mb-6">
        <Link href="/more">
          <ArrowLeft size={24} weight="bold" fill="#363636" className="mr-3" />
        </Link>
        <h1 className="text-xl font-bold text-[#363636]">내 체험단 신청 내역</h1>
      </div>
      {/* 신청 내역 목록 */}
      <div>
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">로딩 중...</div>
        ) : applications.length > 0 ? (
          applications.map((item, idx) => (
            <div key={item.campaignId} className={idx !== applications.length - 1 ? 'mb-4' : ''}>
              <MyApplicationCard application={item} />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            아직 신청한 체험단이 없습니다.
          </div>
        )}
      </div>
      <BottomNavBar />
    </div>
  );
}
