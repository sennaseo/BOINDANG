'use client';

import { useEffect, useState } from 'react';
import ExperienceHeader from '../../components/experience/ExperienceHeader';
import ExperienceList from '../../components/experience/ExperienceList';
import BottomNavBar from '../../components/navigation/BottomNavBar';
import { useAuthStore } from '../../stores/authStore';
import { fetchExperiences } from '../../api/experience';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ExperienceCardProps } from '../../components/experience/ExperienceCard';
import type { Experience } from '../../types/api/experience';

function getRemainingDays(deadline: string, status?: string) {
  if (status === '종료') return '종료';
  const end = new Date(deadline);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return '마감';
  return `${days}일 남음`;
}

const STATUS_OPTIONS = [
  { label: '전체', value: '' },
  { label: '모집 예정', value: '모집 예정' },
  { label: '진행중', value: '진행중' },
  { label: '종료', value: '종료' },
];

const ITEMS_PER_PAGE = 5;

export default function ExperiencePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 0;
  const initialStatus = searchParams.get('status') || '';
  const [experiences, setExperiences] = useState<ExperienceCardProps[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!accessToken) return;
    fetchExperiences(accessToken, status || undefined, ITEMS_PER_PAGE, currentPage).then((response) => {
      const data = (response.data as unknown) as { totalPages: number; campaigns: Experience[] };
      setExperiences(
        data.campaigns.map((item) => ({
          id: String(item.id),
          title: item.name,
          description: item.content,
          imageUrl: item.imageUrl,
          tags: item.hashtags,
          remainingDays: getRemainingDays(item.deadline, item.status),
          maxParticipants: item.capacity,
          openDateTime: item.startDate
            ? item.startDate.slice(5, 10).replace('-', '/') + ' ' + item.startDate.slice(11, 16)
            : '',
        }))
      );
      setTotalPages(data.totalPages);
    });
  }, [accessToken, status, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/experience?page=${page}&status=${status}`);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(0);
    router.push(`/experience?page=0&status=${newStatus}`);
  };

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <ExperienceHeader />
        <div className="mb-6">
          <select
            className="border rounded px-3 py-2 text-sm"
            value={status}
            onChange={e => handleStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <ExperienceList experiences={experiences} />
        <div className="flex justify-center gap-2 mt-4 mb-20">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx)}
              className={`px-3 py-1 border rounded ${currentPage === idx ? 'bg-[#6C2FF2] text-white' : ''}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
} 