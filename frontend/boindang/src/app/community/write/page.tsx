'use client';

import { useState, ChangeEvent, FormEvent, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageSquare, X, CaretDown } from '@phosphor-icons/react';
import { getPresignedUrl, uploadImageToS3, uploadImageMetadata } from '../../../api/image';
import { createCommunityPost } from '../../../api/community';
import { ApiCreatePostRequest } from '../../../types/api/community';
import { Listbox, Transition } from '@headlessui/react';

const categories = ["식단", "운동", "고민&질문", "꿀팁", "목표", "체험단"]; // 예시 카테고리
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default function CommunityWritePage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploadError(null);
    setUploadedImageId(null);
    setSelectedFile(null);
    setPreviewUrl(null);

    if (file.size > MAX_FILE_SIZE) {
      setImageUploadError(`파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.`);
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setImageUploadError('JPEG, PNG, GIF 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const presignedUrlResponse = await getPresignedUrl(file.type, file.name);
      console.log('Presigned URL Response:', presignedUrlResponse);
      console.log('[DEBUG] Keys in presignedUrlResponse.data:', Object.keys(presignedUrlResponse.data || {}));

      if (!presignedUrlResponse.success || !presignedUrlResponse.data) {
        let apiErrorMessage = 'Presigned URL을 가져오는데 실패했습니다.';
        if (presignedUrlResponse.error) {
          if (typeof presignedUrlResponse.error === 'string') {
            apiErrorMessage = presignedUrlResponse.error;
          } else if ((presignedUrlResponse.error as { message?: string })?.message) {
            apiErrorMessage = (presignedUrlResponse.error as { message: string }).message;
          }
        }
        throw new Error(apiErrorMessage);
      }

      const { fileKey, presignedUrl } = presignedUrlResponse.data;

      // 디버깅 로그 추가
      console.log('[DEBUG] Before check - presignedUrlResponse.data.presignedUrl:', presignedUrlResponse.data.presignedUrl);
      console.log('[DEBUG] Before check - destructured presignedUrl:', presignedUrl);
      console.log('[DEBUG] Before check - typeof destructured presignedUrl:', typeof presignedUrl);

      if (!presignedUrl) {
        throw new Error('API 응답에서 Pre-signed URL을 찾을 수 없습니다.');
      }
      console.log('File Key:', fileKey);
      console.log('Presigned URL for S3 Upload:', presignedUrl);

      const s3UploadSuccess = await uploadImageToS3(presignedUrl, file);
      if (!s3UploadSuccess) {
        throw new Error('S3에 이미지를 업로드하는데 실패했습니다.');
      }
      console.log('Image uploaded to S3 successfully.');

      const metadataResponse = await uploadImageMetadata(fileKey);
      console.log('Metadata Response:', metadataResponse);

      if (!metadataResponse || typeof metadataResponse.imageId !== 'number') {
        throw new Error('이미지 메타데이터를 업로드하고 ID를 가져오는데 실패했습니다.');
      }

      setUploadedImageId(metadataResponse.imageId);
      setImageUploadError(null);
      console.log('Image ID received:', metadataResponse.imageId);

    } catch (err: unknown) {
      console.error('Image processing error in handleFileChange:', err);
      let errorMessage = '이미지 처리 중 오류가 발생했습니다.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setImageUploadError(errorMessage);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedImageId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageId(null);
    setImageUploadError(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // title 유효성 검사 제거
    // if (!title.trim()) {
    //   setError('제목을 입력해주세요.');
    //   return;
    // }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    if (!category) {
      setError('카테고리를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const postDataRequest: ApiCreatePostRequest = {
        content,
        category,
        imageId: uploadedImageId,
      };
      const apiResponse = await createCommunityPost(postDataRequest);

      if (apiResponse.success && apiResponse.data && typeof apiResponse.data.postId === 'number') {
        // 먼저 /community로 push하여 히스토리에 기록
        router.push('/community');
        // 그 다음, 현재 히스토리 항목을 상세 페이지로 replace
        router.replace(`/community/${apiResponse.data.postId}`);
      } else {
        // createCommunityPost 함수 내부에서 이미 상세 오류를 콘솔에 로깅했을 수 있음
        // 여기서는 사용자에게 보여줄 오류 메시지를 설정
        throw new Error(apiResponse.error?.message || '게시글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: unknown) {
      console.error('Post creation error in handleSubmit catch block:', err);
      let errorMessage = '게시글 작성 중 오류가 발생했습니다.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        // err 객체가 Error 인스턴스는 아니지만 message: string 속성을 가지고 있는 경우
        errorMessage = (err as { message: string }).message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-x-3">
          <button onClick={() => router.push('/community')} aria-label="닫기">
            <X size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold">글쓰기</h1>
        </div>
        <button
          type="submit"
          form="community-write-form"
          disabled={isLoading || !category || content.length === 0 || (selectedFile !== null && uploadedImageId === null && !imageUploadError)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${isLoading || !category || content.length === 0 || (selectedFile !== null && uploadedImageId === null && !imageUploadError) ? 'text-gray-400 cursor-not-allowed' : 'text-[#6C2FF2] hover:text-[#5a27cc]'}`}
        >
          완료
        </button>
      </header>

      <main className="flex-grow p-4 space-y-6">
        <form id="community-write-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Listbox value={category} onChange={setCategory}>
              {({ open }) => (
                <div className="relative">
                  <Listbox.Button className="relative w-full py-3 pl-4 pr-10 text-left bg-white border border-[#6C2FF2] rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#6C2FF2]/50 sm:text-sm">
                    <span className={`block truncate ${category ? 'text-gray-900' : 'text-gray-500'}`}>
                      {category || '게시판 선택 *'}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CaretDown
                        className={`w-5 h-5 text-[#6C2FF2] transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-gray-300 focus:outline-none sm:text-sm">
                      {categories.map((cat, catIdx) => (
                        <Listbox.Option
                          key={catIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-[#6C2FF2]/10 text-[#6C2FF2]' : 'text-gray-900'
                            }`
                          }
                          value={cat}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-semibold text-[#6C2FF2]' : 'font-normal'
                                  }`}
                              >
                                {cat}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#6C2FF2]">
                                  {/* 예시: 선택 시 아이콘 (Phosphor 아이콘 사용 시 Check 가져오기 필요) */}
                                  {/* <Check size={16} weight="bold" /> */}
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>

          <div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setContent(e.target.value);
                }
              }}
              placeholder="글을 입력해주세요."
              rows={10}
              className="w-full px-1 py-2 sm:text-sm resize-none focus:outline-none"
              required
              maxLength={1000}
            />
            <p className="text-right text-xs text-gray-500 mt-1">
              {content.length}/1000자
            </p>
          </div>

          <div>
            {previewUrl ? (
              <div className="relative group w-full h-40 border border-gray-300 rounded-lg flex justify-center items-center bg-gray-50">
                <Image src={previewUrl} alt="미리보기" layout="fill" objectFit="contain" className="rounded-lg" />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition-opacity"
                  aria-label="이미지 삭제"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                <ImageSquare size={36} className="mb-2 text-gray-400" />
                <span className="text-sm">사진 추가하기 {selectedFile ? '(1/1)' : '(0/1)'}</span>
                <input
                  id="image-upload"
                  type="file"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {imageUploadError && <p className="text-sm text-red-600 mt-2">{imageUploadError}</p>}
            {selectedFile && uploadedImageId === null && !imageUploadError && isLoading && (
              <p className="text-sm text-blue-600 mt-2">이미지 처리 중...</p>
            )}
            {selectedFile && uploadedImageId !== null && !imageUploadError && (
              <p className="text-sm text-green-600 mt-2">이미지 준비 완료!</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </form>
      </main>
    </div>
  );
}
