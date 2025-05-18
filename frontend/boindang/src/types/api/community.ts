// 게시글 목록 조회 api 응답 타입
export interface ApiPostItem {
  postId: number;
  category: string | null;
  title: string;
  content: string;
  imageId: number | null;
  username: string;
  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
}

export interface ApiPostListData {
  totalPage: number;
  posts: ApiPostItem[];
}



// 이미지 ID 목록으로 이미지 정보 목록 조회 API 관련 타입
export type ApiImageIdListRequest = number[];

export interface ApiImageListItem {
  imageId: number;
  userId: number;
  imageUrl: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  deletedAt: string | null; // ISO 8601 형식 또는 null
}

export interface ApiImageListResponse {
  data: ApiImageListItem[] | null; // 성공 시 이미지 정보 배열, 실패 또는 데이터 없을 시 null
  error: string | null; // 에러 메시지 또는 null
  success: boolean; // 성공 여부
}



// 게시글 상세 조회 API 관련 타입
export interface ApiCommentItem {
  commentId: number;
  authorNickname: string;
  authorId: number;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  content: string;
  isMine: boolean;
}

export interface ApiPostDetailData {
  postId: number;
  category: string | null;
  title: string;
  content: string;
  imageId: number | null;
  username: string;
  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  comments: ApiCommentItem[];
}

export interface ApiResponsePostDetail {
  isSuccess: boolean;
  code: number;
  message: string;
  data: ApiPostDetailData;
}

// 게시글 작성 API 관련 타입
export interface ApiCreatePostRequest {
  category: string;
  content: string;
  imageId?: number | null; // 선택적 필드, 이미지가 없을 수도 있음
}

export interface ApiCreatePostResponseData {
  postId: number;
}

export interface ApiResponseCreatePost {
  isSuccess: boolean;
  code: number;
  message: string;
  data: ApiCreatePostResponseData;
}

/**
 * 게시글 삭제 API 응답 타입
 */
export interface ApiResponseDeletePost {
  isSuccess: boolean;
  code: number;
  message: string;
  data: null;
}

/**
 * 게시글 좋아요/취소 API 응답 타입
 */
export interface ApiResponseLikePost {
  isSuccess: boolean;
  code: number;
  message: string;
  data: null;
}


