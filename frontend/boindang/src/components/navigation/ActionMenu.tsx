'use client';

import { Camera, NewspaperClipping, Trophy, BookmarkSimple, Plus } from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from 'framer-motion';

interface ActionMenuProps {
  onClose: () => void;
}

const menuLinks = [
  { href: "/ocr/camera", icon: Camera, label: "성분 분석" },
  { href: "/news", icon: NewspaperClipping, label: "카드 뉴스" },
  { href: "/quiz", icon: Trophy, label: "영양 퀴즈" },
  { href: "/experience", icon: BookmarkSimple, label: "체험단" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.4 } },
};

const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { type: "spring", bounce: 0.2, duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const itemsAnchorVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1,
    },
  },
};

const popOutItemVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 50 },
  visible: (custom: { x: number; y: number; }) => ({
    opacity: 1,
    scale: 1,
    x: custom.x,
    y: custom.y,
    transition: { type: "spring", stiffness: 280, damping: 18 },
  }),
  exit: {
    opacity: 0,
    scale: 0,
    y: 0,
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 20, 
      duration: 0.3 
    },
  },
};

const getArcPositions = (count: number, radius: number, verticalOffset: number = 0) => {
  const positions: Array<{ x: number; y: number }> = [];
  const angleSpread = count > 1 ? Math.PI * (2 / 3) : 0;
  const angleStart = -Math.PI / 2 - angleSpread / 2;

  for (let i = 0; i < count; i++) {
    if (count === 1) {
      positions.push({ x: 0, y: -radius + verticalOffset });
      continue;
    }
    const angle = angleStart + (i / (count - 1)) * angleSpread;
    positions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius + verticalOffset,
    });
  }
  return positions;
};

export default function ActionMenu({ onClose }: ActionMenuProps) {
  const itemPositions = getArcPositions(menuLinks.length, 120, 100);

  return (
    <motion.div
      className="fixed inset-0 bg-gray-900/75 z-50 flex items-end justify-center"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="w-full md:w-[440px] md:mx-auto pt-10 pb-8.5 px-6 flex flex-col items-center relative z-[51] overflow-hidden shadow-xl"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="relative w-full h-[180px] flex justify-center items-center"
          variants={itemsAnchorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {menuLinks.map((item, index) => (
            <motion.div
              key={item.label}
              custom={itemPositions[index]}
              variants={popOutItemVariants}
              className="absolute"
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-full bg-slate-100 hover:bg-slate-200 text-fuchsia-700 shadow-lg cursor-pointer transition-colors duration-150"
              >
                <item.icon size={26} weight="bold" />
                <span className="mt-1 text-[10px] font-semibold text-center px-1">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          onClick={onClose}
          className="bg-[#6C2FF2] rounded-full w-15 h-15 flex items-center justify-center text-white shadow-md focus:outline-none hover:bg-[#5A1EDC] transition-colors"
          aria-label="메뉴 닫기"
          initial={{ rotate: 0 }}
          animate={{ rotate: 135 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          exit={{ rotate: 0, opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        >
          <Plus size={24} weight="bold" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
