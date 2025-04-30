'use client';

import { useState, useEffect } from 'react';
import { User, PencilSimple, Heart, ChatCircle } from '@phosphor-icons/react';
import BottomNavBar from '../../components/navigation/BottomNavBar';

const categories = ["전체", "식단", "운동", "고민&질문", "꿀팁", "목표", "체험단"];
const tabs = ["피드", "매거진"];

// 임시 더미 데이터 타입 (필요시 확장)
interface Post {
  id: number;
  authorName: string;
  authorImage: string; // 임시로 Tailwind 배경색 클래스 사용
  timeAgo: string;
  content: string;
  imageUrl?: string | null; // 이미지 URL 또는 placeholder 식별자, null 허용
  likes: number;
  isLiked: boolean;
}

// 초기 더미 데이터 확장
const initialPosts: Post[] = [
  { id: 1, authorName: '털털한자두7323', authorImage: 'bg-purple-200', timeAgo: '4분 전', content: '생선구이 맛집 추천좀 해주세요! 🐟', imageUrl: 'placeholder', likes: 12, isLiked: false },
  { id: 2, authorName: '운동하는쿼카', authorImage: 'bg-blue-200', timeAgo: '30분 전', content: '오늘 오운완! 다들 득근하세요 💪 #운동인증', imageUrl: null, likes: 25, isLiked: true },
  { id: 3, authorName: '식단조절러', authorImage: 'bg-green-200', timeAgo: '1시간 전', content: '저녁으로 샐러드랑 닭가슴살 먹었어요. 생각보다 맛있네요? 다음엔 다른 드레싱 시도해봐야지🥗', imageUrl: null, likes: 8, isLiked: false },
  { id: 4, authorName: '꿀팁전도사', authorImage: 'bg-yellow-200', timeAgo: '2시간 전', content: '혈당 스파이크 막는 식후 15분 걷기! 짧지만 효과 좋아요.', imageUrl: null, likes: 55, isLiked: true },
  { id: 5, authorName: '목표달성가자', authorImage: 'bg-red-200', timeAgo: '3시간 전', content: '이번 주 목표: 매일 만 보 걷기 도전! 같이 하실 분? 🙌', imageUrl: 'placeholder_walk', likes: 31, isLiked: false },
  { id: 6, authorName: '고민상담소', authorImage: 'bg-indigo-200', timeAgo: '5시간 전', content: '식단 조절 너무 어려운데 다들 어떻게 하시나요? ㅠㅠ 간식 참기가 제일 힘들어요.', imageUrl: null, likes: 19, isLiked: false },
  { id: 7, authorName: '체험단리뷰어', authorImage: 'bg-pink-200', timeAgo: '1일 전', content: '이번에 새로 나온 저당 간식 체험해봤는데, 생각보다 달고 맛있어서 놀랐어요! 자세한 후기는 블로그에... (는 농담이고 여기다 쓸게요 ㅋㅋ)', imageUrl: 'placeholder_snack', likes: 42, isLiked: true },
  { id: 8, authorName: '요리왕비룡', authorImage: 'bg-teal-200', timeAgo: '2일 전', content: '두부면으로 만든 파스타! 밀가루 없이 맛있게 즐길 수 있어요. 레시피 공유합니다🍝', imageUrl: null, likes: 77, isLiked: false },
];

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("피드");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [lastScrollY, setLastScrollY] = useState(0); // 이전 스크롤 위치
  const [showFullHeader, setShowFullHeader] = useState(true); // 전체 헤더 표시 여부

  // 좋아요 토글 핸들러
  const handleLikeToggle = (postId: number) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          // 좋아요 상태 반전 및 카운트 조정
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 50) { // 상단 근처에서는 항상 표시
        setShowFullHeader(true);
      } else {
        if (currentScrollY > lastScrollY) { // 스크롤 다운
          setShowFullHeader(false);
        } else { // 스크롤 업
          setShowFullHeader(true);
        }
      }
      setLastScrollY(currentScrollY); // 이전 스크롤 위치 업데이트
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="bg-background min-h-screen text-text-primary">
      {/* Sticky Header Container */}
      <div className="sticky top-0 z-20 bg-background">
        {/* Part 1: Always visible - Title and Icons */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">커뮤니티</h1>
            <div className="flex items-center gap-x-4">
              <button aria-label="사용자 프로필">
                <User size={24} weight="fill" color="#4A5568" />
              </button>
              <button aria-label="글쓰기">
                <PencilSimple size={24} weight="fill" color="#4A5568" />
              </button>
            </div>
          </div>
        </div>

        {/* Part 2: Conditionally visible - Tabs and Categories */}
        <div
          className={`transition-all duration-300 ease-in-out ${showFullHeader ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          {/* Tab Navigation */}
          <div className="flex w-full border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 py-3 px-4 text-center font-semibold transition-colors duration-200 ease-in-out ${activeTab === tab
                  ? 'text-[#6C2FF2] after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-50 after:h-1.5 after:bg-[#6C2FF2] after:rounded-t'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Category Chips (only if Feed tab is active) */}
          {activeTab === '피드' && (
            <div className="flex overflow-x-auto py-3 gap-x-2 scrollbar-hide px-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out ${activeCategory === category ? 'border border-[#6C2FF2] text-[#6C2FF2]' : 'border border-gray-300 text-gray-700 hover:border-[#6C2FF2] hover:text-[#6C2FF2]'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div> {/* End of Sticky Header Container */}

      {/* Feed or Magazine Content */}
      {/* TODO: Display different content when Magazine tab is selected */}
      <main className="pt-4 pb-[70px] flex flex-col divide-y divide-gray-200">
        {/* 피드 탭 활성 시 게시물 목록 렌더링 */}
        {activeTab === '피드' && posts.map((post) => (
          <div key={post.id} className="bg-white p-4 shadow-sm">
            {/* 사용자 정보 */}
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded-full ${post.authorImage} mr-2`}></div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{post.authorName}</p>
                <p className="text-xs text-text-secondary">{post.timeAgo}</p>
              </div>
            </div>
            {/* 본문 내용 - 이미지 유무에 따라 mb 조정 */}
            <p className={`text-text-primary text-sm ${post.imageUrl ? 'mb-2' : 'mb-4'}`}>{post.content}</p>
            {/* 이미지 영역 (이미지 URL이 있을 경우) */}
            {post.imageUrl && (
              <div className="h-[180px] bg-gray-100 rounded-[22px] mb-4 flex items-center justify-center text-gray-400">
                {/* TODO: 실제 이미지 컴포넌트 또는 img 태그 사용 */}
                (이미지: {post.imageUrl})
              </div>
            )}
            {/* 좋아요 / 댓글 버튼 */}
            <div className="flex items-center text-gray-600">
              <button
                onClick={() => handleLikeToggle(post.id)}
                className="w-1/2 flex justify-center items-center gap-x-1"
              >
                <Heart size={22} weight="fill" color={post.isLiked ? '#6C2FF2' : '#A0AEC0'} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="w-1/2 flex justify-center items-center gap-x-1">
                <ChatCircle size={22} weight="fill" color="#A0AEC0" />
                {/* TODO: 실제 댓글 수 표시 */}
                <span className="text-sm">댓글 달기</span>
              </button>
            </div>
          </div>
        ))}

        {/* 매거진 탭 활성 시 */}
        {activeTab === '매거진' && (
          <div className="p-4 text-center text-gray-500">
            매거진 콘텐츠가 여기에 표시됩니다.
          </div>
        )}
      </main>
      <BottomNavBar />
    </div>
  );
}
