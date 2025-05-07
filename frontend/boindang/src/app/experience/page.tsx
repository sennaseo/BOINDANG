'use client';

import ExperienceHeader from '../../components/experience/ExperienceHeader';
import ExperienceList from '../../components/experience/ExperienceList';
import BottomNavBar from '../../components/navigation/BottomNavBar';

// 임시 데이터
const mockExperiences = [
  {
    id: '1',
    title: '[4/25 오픈] 무설탕 프로틴 쉐이크 체험단',
    description: '설탕은 제로, 단백질은 가득! 건강한 단백질 보충제의 새로운 기준',
    imageUrl: '/images/temp/product1.jpg',
    tags: ['무설탕', '단백질24g', '지방0g'],
    remainingDays: 12,
    maxParticipants: 100,
    openDateTime: '4/25 06:23',
  },
  {
    id: '2',
    title: '[4/26 오픈] 저당 그래놀라 100명 체험단',
    description: '오트밀과 견과류로 만든 건강한 아침 한 끼, 당 함량 50% 감소',
    imageUrl: '/images/temp/product2.jpg',
    tags: ['저당', '식이섬유8g', '통곡물'],
    remainingDays: 8,
    maxParticipants: 100,
    openDateTime: '4/26 10:00',
  },
  {
    id: '3',
    title: '[4/27 오픈] 무설탕 수제 요거트 선착순 모집',
    description: '천연 유산균만으로 발효한 진짜 요거트, 인공감미료 무첨가',
    imageUrl: '/images/temp/product3.jpg',
    tags: ['무설탕', '프로바이오틱스', '무첨가'],
    remainingDays: 15,
    maxParticipants: 50,
    openDateTime: '4/27 09:00',
  },
];

export default function ExperiencePage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <ExperienceHeader />
        <ExperienceList experiences={mockExperiences} />
      </main>
      <BottomNavBar />
    </div>
  );
} 