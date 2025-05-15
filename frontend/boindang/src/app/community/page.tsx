'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image 컴포넌트 임포트
import { User, PencilSimple, Heart, ChatCircle } from '@phosphor-icons/react';
import BottomNavBar from '../../components/navigation/BottomNavBar';
import { getCommunityPosts, getImageListByIds, toggleLikePost } from '../../api/community'; // getImageListByIds, toggleLikePost 임포트
import { ApiPostItem } from '../../types/api/community';

const categories = ["전체", "식단", "운동", "고민&질문", "꿀팁", "목표", "체험단"];
const tabs = ["피드", "매거진"];

// 기존 Post 인터페이스는 API 연동으로 인해 ApiPostItem으로 대체되거나,
// ApiPostItem을 Post 형태로 변환하는 로직이 필요합니다. 여기서는 우선 ApiPostItem을 직접 사용합니다.
// interface Post {
//   id: number;
//   authorName: string;
//   authorImage: string;
//   timeAgo: string;
//   content: string;
//   imageUrl?: string | null;
//   likes: number;
//   isLiked: boolean;
// }

// 초기 더미 데이터는 API 연동으로 인해 제거됩니다.
// const initialPosts: Post[] = [ ... ];

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("피드");
  const [posts, setPosts] = useState<ApiPostItem[]>([]);
  const [imageUrlsMap, setImageUrlsMap] = useState<Map<number, string>>(new Map()); // 이미지 URL 맵 상태 추가
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFullHeader, setShowFullHeader] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsAndImages = async () => {
      setIsLoading(true);
      setError(null);
      setPosts([]); // 데이터 초기화
      setImageUrlsMap(new Map()); // 이미지 맵 초기화

      try {
        const postData = await getCommunityPosts();
        if (postData && postData.posts) {
          setPosts(postData.posts);

          // 이미지 ID 추출 및 이미지 URL 가져오기
          const imageIdsToFetch = postData.posts
            .map(post => post.imageId)
            .filter((id): id is number => id !== null && id !== undefined);

          if (imageIdsToFetch.length > 0) {
            const uniqueImageIds = [...new Set(imageIdsToFetch)];
            const imageList = await getImageListByIds(uniqueImageIds);
            if (imageList) {
              const newImageUrlsMap = new Map<number, string>();
              imageList.forEach(image => {
                newImageUrlsMap.set(image.imageId, image.imageUrl);
              });
              setImageUrlsMap(newImageUrlsMap);
            }
          }
        } else {
          setError("게시글을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === '피드') {
      fetchPostsAndImages();
    }
  }, [activeTab]);

  const handleLikeToggle = async (postIdToToggle: number) => {
    const originalPosts = [...posts]; // 롤백을 위한 원본 데이터 복사

    // 낙관적 업데이트: UI를 먼저 변경
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.postId === postIdToToggle) {
          return {
            ...post,
            likedByMe: !post.likedByMe,
            likeCount: post.likedByMe ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      })
    );

    try {
      const response = await toggleLikePost(postIdToToggle);
      if (!response || !response.isSuccess) {
        // API 호출 실패 또는 응답 실패 시 롤백
        console.error("Failed to toggle like on server:", response?.message);
        setPosts(originalPosts); // 원래 상태로 롤백
        alert(response?.message || "좋아요 처리에 실패했습니다. 다시 시도해주세요.");
      }
      // 성공 시: UI는 이미 낙관적으로 업데이트 되었으므로 별도 처리 없음
      // 필요하다면 여기서 서버로부터 최신 데이터를 다시 받아올 수도 있습니다.
      // 예: fetchPostsAndImages(); // 단, 전체 목록을 다시 불러오는 것은 비효율적일 수 있음
    } catch (error) {
      // 네트워크 오류 등 예외 발생 시 롤백
      console.error("Error in handleLikeToggle:", error);
      setPosts(originalPosts);
      alert("좋아요 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 50) {
        setShowFullHeader(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setShowFullHeader(false);
        } else {
          setShowFullHeader(true);
        }
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // 재시도 함수
  const retryFetch = () => {
    if (activeTab === '피드') {
      // fetchPostsAndImages를 직접 호출하기 위해 useEffect 내부의 함수를 바깥으로 빼거나, 
      // activeTab 상태를 변경하여 useEffect를 다시 트리거하는 방식을 고려할 수 있습니다.
      // 여기서는 간단하게 activeTab을 잠시 다른 값으로 바꿨다가 되돌려 useEffect를 재실행합니다.
      // 좀 더 나은 방식은 fetchPostsAndImages 함수를 useEffect 밖으로 빼고 직접 호출하는 것입니다.
      const currentTab = activeTab;
      setActiveTab(''); // 임시로 탭 변경하여 useEffect 트리거
      setTimeout(() => setActiveTab(currentTab), 0);
    }
  };

  if (isLoading && activeTab === '피드') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error && activeTab === '피드') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={retryFetch} // 재시도 함수 연결
          className="px-4 py-2 bg-[#6C2FF2] text-white rounded hover:bg-[#5a27cc]"
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-text-primary">
      {/* Sticky Header Container */}
      <div className="sticky top-0 z-20 bg-background">
        {/* Part 1: Always visible - Title and Icons */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">커뮤니티</h1>
            <div className="flex items-center gap-x-4">
              <Link href="/community/profile" aria-label="사용자 프로필">
                <User size={24} weight="fill" color="#4A5568" />
              </Link>
              <Link href="/community/write" aria-label="글쓰기">
                <PencilSimple size={24} weight="fill" color="#4A5568" />
              </Link>
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

      <main className="pt-4 pb-[70px] flex flex-col divide-y divide-gray-200">
        {activeTab === '피드' && posts.map((post) => {
          const imageUrl = post.imageId ? imageUrlsMap.get(post.imageId) : null;
          return (
            <Link key={post.postId} href={`/community/${post.postId}`} className="block bg-white p-4 shadow-sm hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 rounded-full bg-purple-200 mr-2 flex items-center justify-center text-xs text-white`}>
                  {post.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{post.username}</p>
                  <p className="text-xs text-text-secondary">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className={`text-text-primary text-sm ${imageUrl ? 'mb-2' : 'mb-4'} line-clamp-3`}>{post.content}</p>
              {imageUrl && (
                <div className="relative h-[180px] bg-gray-50 rounded-[22px] mb-4 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={"게시글 이미지"}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-[22px]"
                  />
                </div>
              )}
              {!imageUrl && post.imageId && (
                <div className="h-[180px] bg-gray-100 rounded-[22px] mb-4 flex items-center justify-center text-gray-400">
                  이미지 로딩 중...
                </div>
              )}
              <div className="flex items-center text-gray-600 mt-2">
                <div
                  className="w-1/2 flex justify-center items-center gap-x-1 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLikeToggle(post.postId);
                  }}
                >
                  <Heart size={22} weight="fill" color={post.likedByMe ? '#6C2FF2' : '#A0AEC0'} />
                  <span className="text-sm">{post.likeCount}</span>
                </div>
                <div className="w-1/2 flex justify-center items-center gap-x-1 cursor-pointer">
                  <ChatCircle size={22} weight="fill" color="#A0AEC0" />
                  <span className="text-sm">{post.commentCount > 0 ? `${post.commentCount}개 댓글` : '댓글 달기'}</span>
                </div>
              </div>
            </Link>
          );
        })}

        {activeTab === '매거진' && (
          <div className="p-4 text-center text-gray-500">
            매거진 콘텐츠가 여기에 표시됩니다. (현재 피드 데이터만 연동됨)
          </div>
        )}
      </main>
      <BottomNavBar />
    </div>
  );
}
