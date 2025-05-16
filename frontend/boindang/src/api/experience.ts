import apiClient from '@/lib/apiClient';
import { ExperienceListResponse } from '../types/api/experience';

export async function fetchExperiences(
  status?: string,
  size: number = 5,
  page: number = 0
): Promise<ExperienceListResponse> {
  const params: { size: number; page: number; status?: string } = { size, page };
  if (status) params.status = status;
  const response = await apiClient.get('/campaign', {
    params,
  });
  return response.data;
}

// 체험단 상세 조회
export async function fetchExperienceDetail(
  campaignId: number
) {
  const response = await apiClient.get(`/campaign/${campaignId}`);
  return response.data;
}

// 체험단 신청하기
export async function applyExperience(campaignId: number) {
  const response = await apiClient.post(
    `/campaign/${campaignId}/apply`,
    {}
  );
  return response.data;
}