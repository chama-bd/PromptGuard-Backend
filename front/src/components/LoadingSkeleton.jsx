import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="bg-white rounded-[24px] p-8 shadow-sm border border-[#E4E6EF] overflow-hidden relative">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-[#F5F8FA] rounded-[14px] shimmer"></div>
      <div className="flex flex-col gap-2">
        <div className="w-32 h-4 bg-[#F5F8FA] rounded shimmer"></div>
        <div className="w-20 h-3 bg-[#F5F8FA] rounded shimmer"></div>
      </div>
    </div>
    <div className="flex flex-col gap-4">
      <div className="w-full h-20 bg-[#F5F8FA] rounded-[16px] shimmer"></div>
      <div className="flex justify-between">
        <div className="w-24 h-4 bg-[#F5F8FA] rounded shimmer"></div>
        <div className="w-12 h-4 bg-[#F5F8FA] rounded shimmer"></div>
      </div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="p-8 flex flex-col gap-[30px] animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col gap-2">
        <div className="w-48 h-8 bg-gray-200 rounded-lg shimmer"></div>
        <div className="w-32 h-4 bg-gray-100 rounded-md shimmer"></div>
      </div>
      <div className="w-40 h-10 bg-gray-200 rounded-xl shimmer"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
      <div className="h-[400px] bg-white rounded-[32px] border border-[#E4E6EF] shimmer"></div>
      <div className="h-[400px] bg-white rounded-[32px] border border-[#E4E6EF] shimmer"></div>
    </div>
  </div>
);

export default PageSkeleton;
