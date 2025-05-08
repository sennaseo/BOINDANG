'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, XCircle } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import axios from 'axios';
import type {
  IngredientResult,
  IngredientSearchResponseData,
  SearchPageApiResponse
} from '@/types/api/ingredients';

export default function IngredientSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IngredientResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponseData, setApiResponseData] = useState<IngredientSearchResponseData | null>(null);

  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleGoBack = () => {
    router.back(); // 브라우저의 뒤로가기 기능
  };

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setApiResponseData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchIngredients = async () => {
      setIsLoading(true);
      setError(null);
      setApiResponseData(null);

      try {
        const API_ENDPOINT = 'http://k12d206.p.ssafy.io:8081/api/ingredients/search';

        const response = await axios.get<SearchPageApiResponse>(API_ENDPOINT, {
          params: {
            query: searchTerm.trim(),
          },
        });

        if (response.data.isSuccess && response.data.data) {
          setSearchResults(response.data.data.results);
          setApiResponseData(response.data.data);
        } else {
          setError(response.data.message || '검색 결과를 가져오는데 실패했습니다.');
          setSearchResults([]);
        }
      } catch (err) {
        console.error("API 요청 에러:", err);
        if (axios.isAxiosError(err) && err.response) {
          const errorData = err.response.data as SearchPageApiResponse;
          setError(errorData.message || '요청 중 에러가 발생했습니다.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 에러가 발생했습니다.');
        }
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchIngredients();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto shadow-sm pb-[70px]">
        {/* 상단 검색 영역 */}
        <div className="bg-white p-4 flex items-center gap-2 sticky top-0 z-10 border-b border-gray-200">
          <button
            onClick={handleGoBack}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="어떤 성분이 궁금하세요?"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 pl-3 pr-10 py-2"
              autoFocus // 페이지 로드 시 자동 포커스
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} weight="fill" />
              </button>
            )}
          </div>
        </div>

        {/* 검색 결과 표시 영역 */}
        <div className="p-4 h-[calc(100vh-57px-70px)] overflow-y-auto">
          {isLoading && (
            <p className="text-gray-500 text-center mt-10">검색 중...</p>
          )}

          {!isLoading && error && (
            <p className="text-red-500 text-center mt-10">
              에러: {error}
            </p>
          )}

          {!isLoading && !error && searchTerm.trim().length < 2 && (
            <p className="text-gray-400 text-center mt-10">
              궁금한 영양 성분을 2자 이상 검색해보세요.
            </p>
          )}

          {!isLoading && !error && apiResponseData && searchTerm.trim().length >= 2 && (
            <>
              {apiResponseData.suggestedName && apiResponseData.suggestedName !== apiResponseData.originalQuery && (
                <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm">
                  {' '}<span className="font-semibold">{apiResponseData.suggestedName}</span>{'(으)로 검색한 결과입니다.'}
                  {/* TODO: 원본 검색어로 다시 검색하는 버튼/링크 추가 */}
                </div>
              )}

              {searchResults.length > 0 ? (
                <div>
                  {!apiResponseData.suggestedName || apiResponseData.suggestedName === apiResponseData.originalQuery ? (
                    <p className="text-gray-700 mb-4">
                      {' '}<span className="font-semibold">{apiResponseData.originalQuery}</span>{' 검색 결과입니다.'}
                    </p>
                  ) : null}
                  <ul className="space-y-2">
                    {searchResults.map((result) => (
                      <li key={result.id} className="p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer">
                        <h3 className="font-semibold text-gray-800">{result.name} ({result.engName})</h3>
                        <div className="text-xs text-gray-600">
                          <span>타입: {result.type}</span>
                          <span className="mx-1">|</span>
                          <span>위험도: {result.riskLevel}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  {' '}<span className="font-semibold">{apiResponseData.originalQuery}</span>{'에 대한 검색 결과가 없습니다.'}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {/* Fixed Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
        <BottomNavBar />
      </div>
    </div>
  );
}