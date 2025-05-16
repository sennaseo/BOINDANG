'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, XCircle, Warning, CaretRight, CheckCircle } from '@phosphor-icons/react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import type { IngredientResult } from '@/types/api/ingredients';
import { useSearchIngredientsQuery } from '@/hooks/queries/useSearchIngredientsQuery';

export default function IngredientSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'suggest' | 'original'>('suggest');
  const router = useRouter();

  const trimmedSearchTerm = searchTerm.trim();
  const shouldAttemptSearch = trimmedSearchTerm.length >= 1;

  const {
    data: apiResponseData,
    isLoading,
    error,
  } = useSearchIngredientsQuery({
    query: trimmedSearchTerm,
    suggested: searchMode === 'suggest',
    enabled: shouldAttemptSearch,
  });

  const searchResults: IngredientResult[] = apiResponseData?.results || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSearchMode('suggest');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchMode('suggest');
  };

  const handleSearchOriginal = (originalQuery: string) => {
    setSearchTerm(originalQuery);
    setSearchMode('original');
  };

  const handleGoBack = () => {
    router.push('/ingredients');
  };

  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : null;

  const showLoading = isLoading && shouldAttemptSearch;
  const showError = !isLoading && errorMessage && shouldAttemptSearch;
  const showInitialMessage = !shouldAttemptSearch && !isLoading;
  const showResults = !isLoading && !errorMessage && shouldAttemptSearch && apiResponseData;

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
              autoFocus
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
          {showLoading && (
            <p className="text-gray-500 text-center mt-10">검색 중...</p>
          )}

          {showError && (
            <p className="text-red-500 text-center mt-10">
              에러: {errorMessage}
            </p>
          )}

          {showInitialMessage && (
            <p className="text-gray-400 text-center mt-10">
              궁금한 영양 성분을 검색해보세요.
            </p>
          )}

          {showResults && (
            <>
              {searchMode === 'suggest' &&
                apiResponseData.suggestedName &&
                apiResponseData.suggestedName !== apiResponseData.originalQuery && (
                  <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm flex flex-wrap items-center gap-x-1">
                    <span className="font-semibold">{apiResponseData.suggestedName}</span>
                    <span>(으)로 검색한 결과입니다.</span>
                    {apiResponseData.originalQuery && (
                      <button
                        onClick={() => handleSearchOriginal(apiResponseData.originalQuery!)}
                        className="text-purple-600 hover:text-purple-800 font-semibold underline ml-1"
                      >
                        `{apiResponseData.originalQuery}` 검색결과 보기
                      </button>
                    )}
                  </div>
                )}

              {searchResults.length > 0 ? (
                <div>
                  {(searchMode === 'original' || !apiResponseData.suggestedName || apiResponseData.suggestedName === apiResponseData.originalQuery) &&
                    apiResponseData.originalQuery && (
                      <p className="text-gray-700 mb-4">
                        <span className="font-semibold">{apiResponseData.originalQuery}</span> 검색 결과입니다.
                      </p>
                    )}
                  <ul className="">
                    {searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/ingredients/detail/${result.id}`)}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          {/* 텍스트 정보 */}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base">
                              {result.name} ({result.engName})
                            </h3>
                            <p className="text-sm text-gray-500">{result.type}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                          {/* 안심 태그 */}
                          {result.riskLevel === '안심' && (
                            <span className="flex items-center bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                              <CheckCircle size={14} weight="fill" className="mr-1 text-green-600" />
                              안심
                            </span>
                          )}
                          {/* 주의 태그 */}
                          {result.riskLevel === '주의' && (
                            <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                              <Warning size={14} weight="fill" className="mr-1 text-yellow-600" />
                              주의
                            </span>
                          )}
                          {/* 위험 태그 */}
                          {result.riskLevel === '위험' && (
                            <span className="flex items-center bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                              <XCircle size={14} weight="fill" className="mr-1 text-red-600" />
                              위험
                            </span>
                          )}
                          <CaretRight size={20} className="text-gray-400" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  <span className="font-semibold">{apiResponseData.originalQuery || trimmedSearchTerm}</span>에 대한 검색 결과가 없습니다.
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
        <BottomNavBar />
      </div>
    </div>
  );
}