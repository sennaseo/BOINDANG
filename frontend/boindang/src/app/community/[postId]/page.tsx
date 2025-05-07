'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, DotsThree, Heart, ChatCircle } from '@phosphor-icons/react';

// 임시 Post 타입 (community/page.tsx 와 동일하게 유지하거나 공유 타입으로 분리 필요)
interface Post {
  id: number;
  authorName: string;
  authorImage: string; // 임시로 Tailwind 배경색 클래스 사용
  timeAgo: string; // 상세 페이지에서는 실제 날짜/시간 표시 고려
  content: string;
  imageUrl?: string | null;
  likes: number;
  isLiked: boolean;
  comments?: Comment[]; // 댓글 데이터 추가 (임시)
}

// 임시 Comment 타입
interface Comment {
  id: number;
  authorName: string;
  authorImage: string;
  timeAgo: string;
  content: string;
}

// 임시 상세 게시글 데이터 (community/page.tsx의 initialPosts와 일부 공유)
// 실제로는 API 호출을 통해 postId에 맞는 데이터를 가져와야 함
const getPostById = (id: number): Post | undefined => {
  const posts: Post[] = [
    { id: 1, authorName: '털털한자두7323', authorImage: 'bg-purple-200', timeAgo: '2025.04.30 오후 3:12', content: '생선구이 맛집 추천좀 해주세요! 🐟', imageUrl: 'placeholder', likes: 12, isLiked: false, comments: [{ id: 101, authorName: '맛잘알', authorImage: 'bg-orange-200', timeAgo: '10분 전', content: '저 여기 가봤는데 진짜 맛있어요!' }] },
    { id: 2, authorName: '운동하는쿼카', authorImage: 'bg-blue-200', timeAgo: '2025.04.30 오후 2:42', content: '오늘 오운완! 다들 득근하세요 💪 #운동인증', imageUrl: null, likes: 25, isLiked: true, comments: [] },
    // ... 다른 게시글 데이터
    { id: 1344, authorName: '파릇파릇한치커리1344', authorImage: 'bg-cyan-200', timeAgo: '25.04.30 오후 3:12', content: 'ㅎㅎㅎ', imageUrl: null, likes: 0, isLiked: false, comments: [] }, // 레퍼런스 이미지와 유사한 데이터 추가
  ];
  return posts.find(post => post.id === id);
};


export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.postId ? parseInt(params.postId as string, 10) : null;

  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (postId !== null) {
      const fetchedPost = getPostById(postId);
      // 실제 API 호출 시 로딩 상태 처리 필요
      setPost(fetchedPost || null); // 데이터 없으면 null 처리
    }
  }, [postId]);

  const handleLikeToggle = () => {
    if (!post) return;
    setPost(currentPost => {
      if (!currentPost) return null;
      return {
        ...currentPost,
        isLiked: !currentPost.isLiked,
        likes: currentPost.isLiked ? currentPost.likes - 1 : currentPost.likes + 1,
      };
    });
    // TODO: API 호출하여 좋아요 상태 업데이트
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    // TODO: API 호출하여 댓글 등록
    console.log('댓글 등록:', commentText);
    // 임시로 댓글 추가 (실제로는 API 응답 후 상태 업데이트)
    const newComment: Comment = {
      id: Date.now(), // 임시 ID
      authorName: '현재사용자', // 실제 사용자 정보 필요
      authorImage: 'bg-gray-300', // 실제 사용자 이미지 필요
      timeAgo: '방금 전',
      content: commentText,
    };
    setPost(currentPost => currentPost ? { ...currentPost, comments: [...(currentPost.comments || []), newComment] } : null);
    setCommentText('');
  };

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 수정하기 핸들러 (임시)
  const handleEdit = () => {
    console.log('수정하기 클릭');
    setIsMenuOpen(false); // 메뉴 닫기
    // TODO: 수정 페이지 이동 또는 수정 모달 표시 로직
  };

  // 삭제하기 핸들러 (임시)
  const handleDelete = () => {
    // console.log('삭제하기 클릭');
    setIsMenuOpen(false); // 메뉴 닫기
    setShowDeleteModal(true); // 삭제 확인 모달 표시
    // TODO: 삭제 확인 및 API 호출 로직
  };

  // 실제 삭제 처리 함수 (임시)
  const confirmDelete = () => {
    console.log(`게시글 ${postId} 삭제 실행`);
    // TODO: API 호출하여 게시글 삭제
    setShowDeleteModal(false);
    // TODO: 삭제 후 목록 페이지로 이동 등 후처리
    router.push('/community'); // 예시: 커뮤니티 목록으로 이동
  };

  if (postId === null) {
    // postId가 없는 경우 (잘못된 접근 등)
    // TODO: 적절한 에러 처리 또는 리다이렉트
    return <div className="p-4 text-center text-red-500">잘못된 접근입니다.</div>;
  }

  if (!post) {
    // TODO: 로딩 상태 UI 표시
    return <div className="p-4 text-center text-gray-500">게시글을 불러오는 중...</div>;
  }

  // 레퍼런스 이미지의 시간 형식과 유사하게 포맷팅 (라이브러리 사용 추천)
  const formatTime = (timeString: string) => {
    // 간단한 변환 예시, 실제로는 날짜 라이브러리(예: date-fns) 사용 권장
    return timeString.replace('오후', '').replace('오전', '').trim();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background">
        <button onClick={() => router.back()} aria-label="뒤로 가기">
          <ArrowLeft size={24} className="text-text-primary" />
        </button>
        <div className="relative flex items-center gap-x-4">
          <button
            onClick={toggleMenu}
            aria-label="더보기"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <DotsThree size={24} weight="bold" className="text-text-primary" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 top-full w-32 bg-white rounded-xl border border-[#6C2FF2] z-20">
              <ul className="py-1">
                <li>
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                  >
                    수정하기
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                  >
                    삭제하기
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* 게시글 내용 영역 (스크롤 가능) */}
      <main className="flex-grow pb-20"> {/* 하단 댓글 입력창 높이만큼 패딩 추가 */}
        {/* 작성자 정보 - 내용 영역의 패딩이 없어졌으므로, 개별 요소에 패딩 추가 */}
        <div className="flex items-center mb-4 px-4 pt-4"> {/* px-4 pt-4 추가 */}
          <div className={`w-10 h-10 rounded-full ${post.authorImage} mr-3`}></div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{post.authorName}</p>
            {/* 레퍼런스 시간 형식 적용 */}
            <p className="text-xs text-text-secondary">{formatTime(post.timeAgo)}</p>
          </div>
        </div>

        {/* 게시글 본문 - 내용 영역의 패딩이 없어졌으므로, 개별 요소에 패딩 추가 */}
        <div className="mb-6 px-4"> {/* px-4 추가 */}
          <p className="text-text-primary whitespace-pre-wrap">{post.content}</p>
          {/* TODO: 이미지/동영상 등 미디어 렌더링 */}
          {post.imageUrl && (
            <div className="mt-4 h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              (이미지 영역: {post.imageUrl})
            </div>
          )}
        </div>

        {/* 좋아요 / 댓글 버튼 */}
        <div className="flex items-center text-gray-600 border-b border-gray-200 py-3">
          {/* 좋아요 버튼 영역 */}
          <button
            onClick={handleLikeToggle}
            className="w-1/2 flex justify-center items-center gap-x-1 text-sm"
          >
            <Heart size={20} weight="fill" color={post.isLiked ? '#6C2FF2' : '#A0AEC0'} />
            <span>좋아요 {post.likes > 0 ? post.likes : ''}</span>
          </button>
          {/* 댓글 달기 버튼 영역 */}
          <button
            className="w-1/2 flex justify-center items-center gap-x-1 text-sm"
          >
            <ChatCircle size={20} weight="fill" color="#A0AEC0" />
            {/* TODO: 실제 댓글 수 표시 */}
            <span>댓글 달기</span>
          </button>
        </div>

        {/* 댓글 목록 - 내용 영역의 패딩이 없어졌으므로, 개별 요소에 패딩 추가 */}
        <div className="mt-6 space-y-4 px-4"> {/* px-4 추가 */}
          {(post.comments || []).map(comment => (
            <div key={comment.id} className="flex">
              <div className={`w-8 h-8 rounded-full ${comment.authorImage} mr-3 flex-shrink-0`}></div>
              <div>
                <div className='flex items-center gap-x-2'>
                  <p className="text-xs font-semibold text-text-primary">{comment.authorName}</p>
                  <p className="text-xs text-text-secondary">{comment.timeAgo}</p>
                </div>
                <p className="text-sm text-text-primary mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
          {/* 댓글이 없을 경우 메시지 (선택 사항) */}
          {(!post.comments || post.comments.length === 0) && (
            <p className="text-sm text-text-secondary text-center py-4">첫 댓글을 남겨보세요!</p>
          )}
        </div>
      </main>

      {/* 하단 댓글 입력창 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-x-2">
          {/* 현재 사용자 프로필 이미지 (임시) 제거 */}
          {/* <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div> */}
          {/* ChatCircle 아이콘 추가 */}
          <ChatCircle size={24} weight="fill" color="#A0AEC0" className="flex-shrink-0" />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 남겨주세요."
            className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#6C2FF2] focus:border-[#6C2FF2]"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`text-sm font-semibold px-3 py-2 rounded-full ${commentText.trim() ? 'text-[#6C2FF2]' : 'text-gray-400 cursor-not-allowed'}`}
          >
            등록
          </button>
        </form>
      </footer>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(0,0,0,0.25)]">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs mx-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2 text-center">게시글을 삭제하시겠습니까?</h2>
            <p className="text-sm text-text-secondary mb-6 text-center">삭제한 글은 되돌릴 수 없습니다.</p>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 px-4 py-3 bg-gray-100 text-text-primary font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="w-1/2 px-4 py-3 bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
