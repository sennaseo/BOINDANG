import { ApiResponsePosts, ApiPostListData } from '@/types/api/community';
import apiClient from '../lib/apiClient';
import { ApiImageIdListRequest, ApiImageListItem, ApiImageListResponse } from '@/types/api/community';
import { ApiResponsePostDetail, ApiCreatePostRequest, ApiResponseCreatePost, ApiCreatePostResponseData, ApiResponseDeletePost, ApiResponseLikePost } from "@/types/api/community";
import { AxiosError } from 'axios';

/**
 * 커뮤니티 게시글 목록을 조회하는 API 함수
 * apiClient를 사용하여 요청하며, 인증 토큰은 apiClient의 인터셉터에서 처리합니다.
 * @returns ApiPostListData | null - 성공 시 게시글 데이터, 실패 시 null
 */

export const getCommunityPosts = async (): Promise<ApiPostListData | null> => {
  try {
    // apiClient는 이미 baseURL과 Content-Type 헤더를 가지고 있습니다.
    // Authorization 헤더는 apiClient의 요청 인터셉터에서 처리됩니다.
    const response = await apiClient.get<ApiResponsePosts>('/community/read');

    // Axios는 2xx 상태 코드가 아닌 경우 오류를 발생시키므로, !response.ok와 같은 별도 확인 불필요
    // 응답 데이터는 response.data에 있습니다.
    const result = response.data;

    if (result.isSuccess && result.data) {
      return result.data;
    } else {
      console.error('API request was not successful or data is missing:', result.message);
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error('Error fetching community posts:', axiosError.response?.data?.message || axiosError.message || error);
    return null;
  }
};

/**
 * 이미지 ID 목록을 사용하여 이미지 정보 목록(URL 포함)을 조회하는 API 함수
 * @param imageIds - 조회할 이미지 ID의 배열
 * @returns ApiImageListItem[] | null - 성공 시 이미지 정보 객체의 배열, 실패 시 null
 */
export const getImageListByIds = async (imageIds: ApiImageIdListRequest): Promise<ApiImageListItem[] | null> => {
  // ID 배열이 비어있거나 null이면 요청을 보내지 않고 빈 배열 또는 null을 반환할 수 있습니다.
  if (!imageIds || imageIds.length === 0) {
    return []; // 빈 배열 반환을 기본으로 합니다.
  }

  try {
    // apiClient.post<응답타입>(엔드포인트, 요청바디)
    const response = await apiClient.post<ApiImageListResponse>('/image/imageList', imageIds);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      console.error('Failed to fetch image list or API returned an error:', response.data?.error || 'Unknown error from /imageList');
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    console.error('Error fetching image list from /imageList:', axiosError.response?.data?.error || axiosError.message || error);
    return null;
  }
};

// 게시글 상세 정보를 조회하는 API 함수
export const getPostDetailById = async (postId: number): Promise<ApiResponsePostDetail['data'] | null> => {
  if (isNaN(postId) || postId <= 0) {
    console.error('Invalid postId:', postId);
    return null;
  }
  try {
    const response = await apiClient.get<ApiResponsePostDetail>(`/community/${postId}`);
    if (response.data && response.data.isSuccess) {
      return response.data.data;
    } else {
      console.error('Failed to fetch post detail or API returned an error:', response.data?.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error(`Error fetching post detail for postId ${postId}:`, axiosError.response?.data?.message || axiosError.message || error);
    return null;
  }
};

export const createCommunityPost = async (postData: ApiCreatePostRequest): Promise<ApiCreatePostResponseData | null> => {
  try {
    const response = await apiClient.post<ApiResponseCreatePost>('/community/write', postData);

    if (response.data && response.data.isSuccess && response.data.data && typeof response.data.data.postId === 'number') {
      return response.data.data;
    } else {
      console.error('Failed to create post or invalid response:', response.data?.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error('Error creating community post:', axiosError.response?.data?.message || axiosError.message || error);
    return null;
  }
};

/**
 * 게시글 삭제 API
 * @param postId 삭제할 게시글 ID
 * @returns Promise<ApiResponseDeletePost>
 */
export const deletePost = async (postId: number): Promise<ApiResponseDeletePost> => {
  const response = await apiClient.delete<ApiResponseDeletePost>(`/community/${postId}`);
  return response.data;
};

/**
 * 게시글 좋아요/취소 API 함수
 * @param postId 좋아요 토글할 게시글 ID
 * @returns Promise<ApiResponseLikePost | null> - 성공 시 API 응답, 실패 시 null
 */
export const toggleLikePost = async (postId: number): Promise<ApiResponseLikePost | null> => {
  if (isNaN(postId) || postId <= 0) {
    console.error('Invalid postId for like toggle:', postId);
    return null;
  }
  try {
    // 요청 본문 없이 POST 요청
    const response = await apiClient.post<ApiResponseLikePost>(`/community/${postId}/likes`);

    if (response.data && response.data.isSuccess) {
      return response.data;
    } else {
      console.error('Failed to toggle like or API returned an error:', response.data?.message || 'Unknown error');
      return {
        isSuccess: false,
        code: response.data?.code || 0,
        message: response.data?.message || 'Unknown error',
        data: null
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ code?: number; message?: string }>;
    console.error(`Error toggling like for postId ${postId}:`, axiosError.response?.data?.message || axiosError.message || error);
    return {
      isSuccess: false,
      code: axiosError.response?.data?.code || 0,
      message: axiosError.response?.data?.message || 'Error toggling like',
      data: null
    };
  }
};
