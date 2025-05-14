import { ExperienceListResponse } from '../types/api/experience';

export async function fetchExperiences(
  accessToken: string,
  status?: string,
  size: number = 5,
  page: number = 0
): Promise<ExperienceListResponse> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('size', size.toString());
  params.append('page', page.toString());

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaign?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('체험단 목록을 불러오지 못했습니다.');
  return res.json();
}

// 체험단 상세 조회
export async function fetchExperienceDetail(
  accessToken: string,
  campaignId: number
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaign/${campaignId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('체험단 상세 정보를 불러오지 못했습니다.');
  return res.json();
}