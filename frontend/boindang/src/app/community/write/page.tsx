'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ImageSquare, X } from '@phosphor-icons/react';
import { getPresignedUrl, uploadImageToS3, uploadImageMetadata } from '../../../api/image';
import { createCommunityPost } from '../../../api/community';
import { ApiCreatePostRequest } from '../../../types/api/community';

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
      const postData: ApiCreatePostRequest = {
        // title, // title 제거
        content,
        category,
        imageId: uploadedImageId,
      };
      const result = await createCommunityPost(postData); // result is ApiCreatePostResponseData | null

      if (result && typeof result.postId === 'number') { // Successfully created
        router.push(`/community/${result.postId}`);
      } else {
        // Creation failed, result is null (or somehow not ApiCreatePostResponseData)
        // createCommunityPost (API 함수) 내부에서 이미 상세한 오류를 콘솔에 로깅하고 null을 반환합니다.
        // 따라서 여기서는 사용자에게 보여줄 일반적인 실패 메시지를 throw 합니다.
        throw new Error('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: unknown) { // any 대신 unknown 사용
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => router.back()} aria-label="뒤로 가기">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">글쓰기</h1>
        <button
          type="submit"
          form="community-write-form"
          disabled={isLoading || (selectedFile !== null && uploadedImageId === null && !imageUploadError)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${isLoading || (selectedFile !== null && uploadedImageId === null && !imageUploadError) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#6C2FF2] text-white hover:bg-[#5a27cc]'}`}
        >
          {isLoading && uploadedImageId === null && selectedFile !== null ? '이미지 처리중' : isLoading ? '등록중...' : '등록'}
        </button>
      </header>

      <main className="flex-grow p-4 space-y-6">
        <form id="community-write-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6C2FF2] focus:border-[#6C2FF2] sm:text-sm"
              required
            >
              <option value="" disabled>카테고리를 선택하세요</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요 (최소 10자 이상)"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6C2FF2] focus:border-[#6C2FF2] sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">이미지 첨부 (선택)</label>
            {previewUrl ? (
              <div className="relative group w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center">
                <Image src={previewUrl} alt="미리보기" layout="fill" objectFit="contain" className="rounded-md" />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="이미지 삭제"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col justify-center items-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors">
                <ImageSquare size={48} className="mb-2" />
                <span>클릭하여 이미지 선택</span>
                <span className="text-xs mt-1">최대 {MAX_FILE_SIZE / 1024 / 1024}MB, JPG/PNG/GIF</span>
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
