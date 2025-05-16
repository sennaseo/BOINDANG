import Link from 'next/link';
import type { MyApplication } from '@/types/api/more/experience';

interface MyApplicationCardProps {
  application: MyApplication;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

export default function MyApplicationCard({ application }: MyApplicationCardProps) {
  return (
    <Link href={`/experience/${application.campaignId}`}>
      <div className="border rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-md transition">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-[#363636]">{application.title}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${application.isSelected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {application.isSelected ? '당첨' : '미당첨'}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          신청일: {formatDate(application.appliedAt)}
        </span>
      </div>
    </Link>
  );
} 