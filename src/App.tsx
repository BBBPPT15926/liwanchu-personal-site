import { ArrowRight, Check } from 'lucide-react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import LetterGlitch from './components/LetterGlitch';
import { siteMedia } from './siteConfig';

const CREAM_TEXT = '#E1E0CC';
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

type FeatureLayoutDirection = 'normal' | 'reverse';
type FeatureAnimationMode = 'default' | 'impact';

function getFeatureGridVariants(direction: FeatureLayoutDirection) {
  const isReverse = direction === 'reverse';

  return {
    hidden: {
      transition: {
        staggerChildren: 0.12,
        staggerDirection: isReverse ? 1 : -1,
      },
    },
    visible: {
      transition: {
        staggerChildren: 0.15,
        staggerDirection: isReverse ? -1 : 1,
      },
    },
  };
}

const navItems = [
  { label: '关于我', href: '#about' },
  { label: '工作经历', href: '#features' },
  { label: '项目经历', href: '#features-copy-1' },
  { label: '造梦现场', href: '#features-copy-2' },
];

type Feature = {
  number: string;
  title: string;
  image: string;
  items: string[];
};

type FeatureDisplayMode = 'cards' | 'dream-squares';

const featureImages = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
] as const;

const features: Feature[] = [
  {
    number: '01',
    title: '项目分镜。',
    image: featureImages[0],
    items: [
      '用场景图整理参考、节奏与视觉提示。',
      '为导演、制片人与剪辑师共享时间线。',
      '让情绪板始终连接到镜头清单。',
      '一键导出可用于提案与工作坊的分镜。',
    ],
  },
  {
    number: '02',
    title: '智能评审。',
    image: featureImages[1],
    items: [
      '分析节奏、对比、连续性与视觉张力。',
      '把反馈转译成可执行的创作决策。',
      '与工具联动，让评审贴近工作文件。',
    ],
  },
  {
    number: '03',
    title: '沉浸舱。',
    image: featureImages[2],
    items: [
      '为深度创作与内部放映静默通知。',
      '按项目阶段切换环境声景。',
      '同步评审、拍摄、剪辑与恢复节奏。',
    ],
  },
];

const dreamSceneFeatures: Feature[] = [
  {
    number: '01',
    title: '项目分镜。',
    image: featureImages[0],
    items: [
      '整理参考、节奏与视觉提示。',
      '共享时间线与镜头清单。',
      '沉淀可复用分镜素材。',
    ],
  },
  {
    number: '02',
    title: '智能评审。',
    image: featureImages[1],
    items: [
      '分析节奏、对比与连续性。',
      '把反馈转成创作决策。',
      '让评审贴近工作文件。',
    ],
  },
  {
    number: '03',
    title: '沉浸舱。',
    image: featureImages[2],
    items: [
      '静默通知，保留创作状态。',
      '按阶段切换环境声景。',
      '同步评审、拍摄与剪辑节奏。',
    ],
  },
  {
    number: '04',
    title: '视觉实验。',
    image: featureImages[0],
    items: [
      '测试概念、构图与情绪走向。',
      '比较不同视觉方向。',
      '保留提示词与迭代记录。',
    ],
  },
  {
    number: '05',
    title: '交互原型。',
    image: featureImages[1],
    items: [
      '把灵感落成可点击工具。',
      '用动效检验交互节奏。',
      '留下可复盘的产品判断。',
    ],
  },
  {
    number: '06',
    title: '叙事拼图。',
    image: featureImages[2],
    items: [
      '组合文本、画面与交互。',
      '调试语气、节拍与反馈。',
      '沉淀创意样本库。',
    ],
  },
];

const workExperienceFeatures: Feature[] = [
  {
    number: '01',
    title: 'AI产品经理',
    image: featureImages[0],
    items: [
      '0-1 AI落地：平台AI能力规划与产品建设',
      '技术助手：1万+规范库，编制效率+80%',
      'CCBIM协同：轻量看模、图纸关联、版本权限',
      '方法论沉淀：数据底座+知识库+Agent工作流',
    ],
  },
  {
    number: '02',
    title: '项目经理',
    image: featureImages[1],
    items: [
      '甲方需求对接：设计边界与执行任务',
      '多专业协作：节点拆解、问题跟踪',
      '风险预警：需求沟通到图纸交付闭环',
      '工程经验：复杂需求结构化与交付管理',
    ],
  },
  {
    number: '03',
    title: '平面设计师',
    image: featureImages[2],
    items: [
      '天猫超市视觉：滚动页与Banner',
      '活动表达：产品宣传与点击转化',
      '审美落地：视觉服务业务目标',
    ],
  },
];

const projectExperienceFeatures: Feature[] = [
  {
    number: '01',
    title: 'AI技术助手',
    image: featureImages[0],
    items: [
      '全局入口：浮窗唤起，不打断流程',
      'RAG问答：知识命中反馈与幻觉控制',
      '多Agent审查：规则引擎与经验复用',
      '价值结果：5000+人次，规范查询提效',
    ],
  },
  {
    number: '02',
    title: 'CCBIM云平台',
    image: featureImages[1],
    items: [
      'BIM协同：云端看模、文件溯源、改动标注',
      '业务拆解：文件管理、版本对比、权限控制',
      '多Agent架构：文件、审图、权限分工',
      '价值结果：10秒内开模，初审准确率85%+',
    ],
  },
];

const firstFeatureAnimationMode: FeatureAnimationMode = 'default';

type WordsPullUpProps = {
  text: string;
  className?: string;
  showAsterisk?: boolean;
};

type StyledSegment = {
  text: string;
  className?: string;
};

type InlinePiece = {
  text: string;
  className?: string;
};

function WordsPullUp({ text, className = '', showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => {
        const isLast = index === words.length - 1;

        return (
          <motion.span
            aria-hidden="true"
            className="relative inline-block overflow-hidden align-baseline"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: easeOutExpo }}
            key={`${word}-${index}`}
          >
            {word}
            {showAsterisk && isLast ? (
              <span className="absolute -right-[0.3em] top-[0.65em] text-[0.31em] leading-none">
                *
              </span>
            ) : null}
            {isLast ? null : <span>&nbsp;</span>}
          </motion.span>
        );
      })}
    </span>
  );
}

function WordsPullUpPieces({ pieces, className = '' }: { pieces: InlinePiece[]; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const label = pieces.map((piece) => piece.text).join('');

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} aria-label={label}>
      {pieces.map((piece, index) => (
        <motion.span
          aria-hidden="true"
          className={`inline-block overflow-hidden align-baseline ${piece.className ?? ''}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.75, delay: index * 0.08, ease: easeOutExpo }}
          key={`${piece.text}-${index}`}
        >
          {piece.text}
        </motion.span>
      ))}
    </span>
  );
}

function WordsPullUpMultiStyle({
  once = true,
  segments,
  className = '',
}: {
  once?: boolean;
  segments: StyledSegment[];
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });
  const words = useMemo(
    () =>
      segments.flatMap((segment) =>
        segment.text.split(' ').map((word) => ({
          word,
          className: segment.className ?? '',
        })),
      ),
    [segments],
  );

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map(({ word, className }, index) => (
        <motion.span
          className={`inline-block overflow-hidden align-baseline ${className}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.75, delay: index * 0.08, ease: easeOutExpo }}
          key={`${word}-${index}`}
        >
          {word}
          <span>&nbsp;</span>
        </motion.span>
      ))}
    </span>
  );
}

function AnimatedLetter({
  children,
  index,
  progress,
  total,
}: {
  children: string;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const midpoint = total <= 1 ? 0 : index / (total - 1);
  const opacity = useTransform(
    progress,
    [Math.max(0, midpoint - 0.1), Math.min(1, midpoint + 0.05)],
    [0.2, 1],
  );

  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function useSectionPresence() {
  const ref = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const element = ref.current;

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        setIsActive(rect.top <= viewportHeight * 0.35 && rect.bottom >= viewportHeight * 0.8);
      });
    };

    update();
    const timer = window.setTimeout(update, 120);

    window.addEventListener('hashchange', update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return [ref, isActive] as const;
}

function useHashAnchorScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);

      if (!hash) {
        return;
      }

      window.requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ block: 'start' });
      });
    };

    scrollToHash();
    const timer = window.setTimeout(scrollToHash, 180);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);
}

function Hero({
  onVideoProgress,
  onVideoReady,
}: {
  onVideoProgress: (progress: number) => void;
  onVideoReady: () => void;
}) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const hasReportedReady = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reportBufferedProgress = (video: HTMLVideoElement) => {
    if (!Number.isFinite(video.duration) || video.duration <= 0 || video.buffered.length === 0) {
      return;
    }

    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    onVideoProgress(Math.min(100, Math.round((bufferedEnd / video.duration) * 100)));
  };

  const handleVideoReady = () => {
    setIsVideoReady(true);
    onVideoProgress(100);

    if (!hasReportedReady.current) {
      hasReportedReady.current = true;
      onVideoReady();
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const checkVideoReady = () => {
      reportBufferedProgress(video);

      if (video.readyState >= 2) {
        handleVideoReady();
        void video.play().catch(() => {});
      }
    };

    checkVideoReady();
    const timer = window.setInterval(checkVideoReady, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="relative h-screen bg-black p-4 md:p-6" id="hero">
      <div className="relative h-full overflow-hidden rounded-2xl bg-black md:rounded-[2rem]">
        <img
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
          src={siteMedia.heroPosterSrc}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
          ref={videoRef}
          src={siteMedia.heroVideoSrc}
          autoPlay
          loop
          muted
          onCanPlay={handleVideoReady}
          onCanPlayThrough={handleVideoReady}
          onError={handleVideoReady}
          onLoadedMetadata={(event) => reportBufferedProgress(event.currentTarget)}
          onLoadedData={handleVideoReady}
          onTimeUpdate={handleVideoReady}
          onPlaying={handleVideoReady}
          onProgress={(event) => reportBufferedProgress(event.currentTarget)}
          playsInline
          poster={siteMedia.heroPosterSrc}
          preload="auto"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <nav
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:rounded-b-3xl md:px-8"
          aria-label="主导航"
        >
          <div className="flex items-center justify-center gap-3 whitespace-nowrap sm:gap-6 md:gap-12 lg:gap-14">
            {navItems.map((item) => (
              <a
                className="text-[10px] transition-colors duration-300 sm:text-xs md:text-sm"
                href={item.href}
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = CREAM_TEXT;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)';
                }}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5 sm:px-6 md:px-8 md:pb-8 lg:px-10">
          <div className="grid items-end gap-4 lg:grid-cols-12 lg:gap-8">
            <h1 className="lg:col-span-8" style={{ color: CREAM_TEXT }}>
              <WordsPullUp
                text="你好！"
                className="block text-[21.25vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[20vw] md:text-[18.75vw] lg:text-[13.75vw] xl:text-[13.125vw] 2xl:text-[12.5vw]"
              />
            </h1>

            <div className="max-w-xl pb-2 md:pb-4 lg:col-span-4 lg:ml-auto lg:max-w-md">
              <motion.p
                className="text-xs leading-[1.22] text-primary/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.9),0_0_18px_rgba(0,0,0,0.75)] sm:text-sm md:text-base"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
              >
                我想做的不是追逐风口，而是在技术与人之间找到连接点，让 AI
                不只显得聪明，而是真的帮助普通人把事情做成。
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });
  const bodyText =
    '现在AI对各行业的产品来说不是一轮软件升级也不是一轮工具迭代，而是一场工业革命。是蜡烛换电灯，马车换汽车。而AI 产品的核心不是 “今天用了什么模型”，而是它是否真正理解业务，是否能被用户使用，是否能被指标验证。';
  const letters = bodyText.split('');

  return (
    <section className="bg-black px-4 py-16 sm:px-6 sm:py-20 md:py-28" id="about">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-6 py-16 text-center sm:px-8 sm:py-20 md:px-12 lg:py-28">
        <p className="mb-6 h-[1em] text-[10px] text-primary sm:text-xs" aria-hidden="true" />

        <h2
          className="mx-auto max-w-6xl text-[1.65rem] font-normal leading-[1.04] text-primary sm:text-[2.15rem] sm:leading-[1] md:text-[2.65rem] lg:text-[3.35rem] xl:text-[4rem]"
          style={{ color: CREAM_TEXT }}
        >
          <span className="block">
            <WordsPullUpPieces pieces={[{ text: '我是李万楚，', className: 'font-serif italic' }]} />
          </span>
          <span className="mt-3 block">
            <WordsPullUpPieces
              pieces={[
                { text: '一名白磷型人格的', className: 'font-serif italic' },
                {
                  text: 'AIPM',
                  className: 'font-sans font-semibold not-italic tracking-[0.08em]',
                },
                { text: '。', className: 'font-serif italic' },
              ]}
            />
          </span>
          <span className="mt-3 block">
            <WordsPullUpPieces
              className="mx-auto max-w-6xl"
              pieces={[{ text: '我擅长把复杂业务目标拆成', className: 'font-serif italic' }]}
            />
          </span>
          <span className="mt-1 block">
            <WordsPullUpPieces
              className="mx-auto max-w-6xl"
              pieces={[
                { text: '可执行、可观测、', className: 'font-serif italic' },
                { text: '可评估的 AI 产品方案。', className: 'font-serif italic' },
              ]}
            />
          </span>
        </h2>

        <p
          ref={paragraphRef}
          className="mx-auto mt-12 max-w-5xl text-xs leading-[1.85] text-[#DEDBC8] sm:mt-14 sm:text-sm md:text-[15px]"
        >
          {letters.map((letter, index) => (
            <AnimatedLetter
              index={index}
              total={letters.length}
              progress={scrollYProgress}
              key={`${letter}-${index}`}
            >
              {letter}
            </AnimatedLetter>
          ))}
        </p>
      </div>
    </section>
  );
}

function FeatureCard({
  animationMode = 'default',
  feature,
  showCta = true,
  showNumber = true,
}: {
  animationMode?: FeatureAnimationMode;
  feature: Feature;
  showCta?: boolean;
  showNumber?: boolean;
}) {
  const isImpact = animationMode === 'impact';
  const variants = isImpact
    ? {
        hidden: {
          x: '-115vw',
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.48, ease: cardEase },
        },
        visible: {
          x: ['-115vw', 22, -8, 0],
          opacity: [0, 1, 1, 1],
          scale: [0.98, 1.015, 0.995, 1],
          transition: {
            duration: 0.88,
            ease: cardEase,
            times: [0, 0.72, 0.88, 1],
          },
        },
      }
    : {
        hidden: {
          opacity: 0,
          scale: 0.95,
          transition: { duration: 0.48, ease: cardEase },
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: cardEase },
        },
      };

  return (
    <motion.article
      className="flex min-h-[380px] flex-col justify-between bg-[#212121] p-5 sm:min-h-[420px] sm:p-6 lg:min-h-0"
      data-motion={animationMode}
      variants={variants}
    >
      <div>
        <img
          className="mb-8 h-10 w-10 rounded object-cover sm:h-12 sm:w-12"
          src={feature.image}
          alt=""
          loading="lazy"
        />

        <div className="mb-8 flex items-start justify-between gap-5">
          <h3 className="max-w-none whitespace-nowrap text-2xl leading-[0.95] text-primary sm:text-3xl">
            {feature.title}
          </h3>
          {showNumber ? <span className="text-sm text-gray-500">{feature.number}</span> : null}
        </div>

        <ul className="space-y-4">
          {feature.items.map((item) => (
            <li className="flex gap-3 text-sm leading-[1.25] text-gray-400" key={item}>
              <Check className="mt-[0.1rem] h-4 w-4 shrink-0 text-primary" strokeWidth={1.9} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {showCta ? (
        <a
          className="mt-10 inline-flex w-max items-center gap-2 text-sm text-primary transition-opacity hover:opacity-70"
          href="mailto:hello@prisma.studio?subject=%E4%BA%86%E8%A7%A3%E6%9B%B4%E5%A4%9A%E6%A3%B1%E9%95%9C%E4%BF%A1%E6%81%AF"
        >
          了解更多
          <ArrowRight className="h-4 w-4 -rotate-45" strokeWidth={1.8} />
        </a>
      ) : null}
    </motion.article>
  );
}

function VideoCard({
  animationMode = 'default',
  shouldLoad = true,
  title,
  videoSrc,
}: {
  animationMode?: FeatureAnimationMode;
  shouldLoad?: boolean;
  title: string;
  videoSrc: string;
}) {
  const isImpact = animationMode === 'impact';
  const variants = isImpact
    ? {
        hidden: {
          x: '-115vw',
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.48, ease: cardEase },
        },
        visible: {
          x: ['-115vw', 22, -8, 0],
          opacity: [0, 1, 1, 1],
          scale: [0.98, 1.015, 0.995, 1],
          transition: {
            duration: 0.88,
            ease: cardEase,
            times: [0, 0.72, 0.88, 1],
          },
        },
      }
    : {
        hidden: {
          opacity: 0,
          scale: 0.95,
          transition: { duration: 0.48, ease: cardEase },
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: cardEase },
        },
      };

  return (
    <motion.article
      className="relative min-h-[380px] overflow-hidden bg-[#212121] sm:min-h-[420px] lg:min-h-0"
      data-motion={animationMode}
      variants={variants}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={shouldLoad ? videoSrc : undefined}
        autoPlay={shouldLoad}
        loop
        muted
        playsInline
        preload={shouldLoad ? 'auto' : 'none'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
      <p className="absolute bottom-5 left-5 right-5 text-2xl leading-[0.95] sm:bottom-6 sm:left-6 sm:right-6 sm:text-3xl">
        {title}
      </p>
    </motion.article>
  );
}

function DreamFeatureSquare({
  animationMode,
  feature,
  showCta,
}: {
  animationMode: FeatureAnimationMode;
  feature: Feature;
  showCta: boolean;
}) {
  const title = feature.title.replace(/[。.]$/, '');
  const isImpact = animationMode === 'impact';
  const variants = isImpact
    ? {
        hidden: {
          x: '-115vw',
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.48, ease: cardEase },
        },
        visible: {
          x: ['-115vw', 22, -8, 0],
          opacity: [0, 1, 1, 1],
          scale: [0.98, 1.015, 0.995, 1],
          transition: {
            duration: 0.88,
            ease: cardEase,
            times: [0, 0.72, 0.88, 1],
          },
        },
      }
    : {
        hidden: {
          opacity: 0,
          scale: 0.95,
          transition: { duration: 0.48, ease: cardEase },
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: cardEase },
        },
      };

  return (
    <motion.article
      className="flex aspect-square h-full max-w-full flex-col justify-between bg-[#212121] p-4 sm:p-5"
      data-motion={animationMode}
      variants={variants}
    >
      <div>
        <div className="flex items-start gap-4">
          <img
            className="h-12 w-12 shrink-0 rounded object-cover sm:h-14 sm:w-14"
            src={feature.image}
            alt=""
            loading="lazy"
          />
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="truncate text-xl leading-none text-primary sm:text-2xl">{title}</h3>
          </div>
        </div>

        <ul className="mt-5 space-y-1.5 text-[11px] leading-[1.32] text-gray-400 sm:text-xs">
          {feature.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {showCta ? (
        <a
          className="mt-3 inline-flex w-max items-center gap-2 text-xs text-primary transition-opacity hover:opacity-70 sm:text-sm"
          href="mailto:hello@prisma.studio?subject=%E4%BA%86%E8%A7%A3%E6%9B%B4%E5%A4%9A%E6%A3%B1%E9%95%9C%E4%BF%A1%E6%81%AF"
        >
          了解更多
          <ArrowRight className="h-3.5 w-3.5 -rotate-45" strokeWidth={1.8} />
        </a>
      ) : null}
    </motion.article>
  );
}

function DreamFeatureSquares({
  animationMode,
  cards,
  showCardCta,
}: {
  animationMode: FeatureAnimationMode;
  cards: Feature[];
  showCardCta: boolean;
}) {
  const variants = {
    hidden: {
      transition: {
        staggerChildren: 0.12,
        staggerDirection: -1,
      },
    },
    visible: {
      transition: {
        staggerChildren: 0.15,
        staggerDirection: 1,
      },
    },
  };

  return (
    <motion.div
      className="grid min-h-[380px] gap-1 sm:min-h-[420px] sm:grid-cols-2 lg:h-full lg:min-h-0 lg:w-max lg:grid-cols-[repeat(3,238px)] lg:grid-rows-2"
      variants={variants}
    >
      {cards.map((feature) => (
        <div className="flex min-h-0" key={feature.number}>
          <DreamFeatureSquare
            animationMode={animationMode}
            feature={feature}
            showCta={showCardCta}
          />
        </div>
      ))}
    </motion.div>
  );
}

function Features({
  animationMode = 'default',
  canvasTitle,
  cards = features,
  featureDisplay = 'cards',
  headline,
  showCardCta = true,
  showCardNumbers = true,
  shouldLoadVideo = true,
  layoutDirection = 'normal',
  sectionId = 'features',
  videoSrc,
}: {
  animationMode?: FeatureAnimationMode;
  canvasTitle: string;
  cards?: Feature[];
  featureDisplay?: FeatureDisplayMode;
  headline: string;
  showCardCta?: boolean;
  showCardNumbers?: boolean;
  shouldLoadVideo?: boolean;
  layoutDirection?: FeatureLayoutDirection;
  sectionId?: string;
  videoSrc: string;
}) {
  const [sectionRef, isSectionActive] = useSectionPresence();
  const isReverseLayout = layoutDirection === 'reverse';
  const isDreamSquares = featureDisplay === 'dream-squares';
  const visibleCardCount = isDreamSquares ? Math.ceil(cards.length / 2) : cards.length;
  const gridColumnClass = isDreamSquares
    ? 'lg:grid-cols-[317px_auto]'
    : visibleCardCount === 2
      ? 'lg:grid-cols-[repeat(3,317px)]'
      : 'lg:grid-cols-4';
  const gridHeightClass = 'lg:h-[480px]';
  const gridWidthClass = isDreamSquares || visibleCardCount === 2 ? 'lg:mx-auto lg:w-max' : 'w-full';
  const gridVariants = useMemo(() => getFeatureGridVariants(layoutDirection), [layoutDirection]);
  const videoCard = (
    <VideoCard
      animationMode={animationMode}
      shouldLoad={shouldLoadVideo}
      title={canvasTitle}
      videoSrc={videoSrc}
    />
  );
  const featureCards = isDreamSquares ? (
    <DreamFeatureSquares
      animationMode={animationMode}
      cards={cards}
      showCardCta={showCardCta}
    />
  ) : (
    cards.map((feature) => (
      <FeatureCard
        animationMode={animationMode}
        feature={feature}
        key={feature.number}
        showCta={showCardCta}
        showNumber={showCardNumbers}
      />
    ))
  );

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-20 md:py-28"
      id={sectionId}
      ref={sectionRef}
    >
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-none overflow-visible text-center sm:mb-16">
          <h2 className="text-lg font-normal leading-[1.05] sm:text-xl md:text-2xl lg:text-3xl">
            <WordsPullUpMultiStyle
              className="flex-nowrap whitespace-nowrap"
              once={false}
              segments={[
                {
                  text: headline,
                  className: 'text-primary',
                },
              ]}
            />
          </h2>
        </header>

        <motion.div
          className={`grid gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 ${gridHeightClass} ${gridWidthClass} ${gridColumnClass}`}
          animate={isSectionActive ? 'visible' : 'hidden'}
          initial="hidden"
          variants={gridVariants}
        >
          {isReverseLayout ? featureCards : videoCard}
          {isReverseLayout ? videoCard : featureCards}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureVideoWarmup({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0"
    >
      {Object.values(siteMedia.featureVideos).map((videoSrc) => (
        <video key={videoSrc} src={videoSrc} muted playsInline preload="auto" />
      ))}
    </div>
  );
}

function LoadingIntro({ progress, visible }: { progress: number; visible: boolean }) {
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const progressAngle = displayProgress * 3.6;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${
        visible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      animate={{ opacity: visible ? 1 : 0 }}
      initial={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,44,44,0.16),rgba(0,0,0,0)_34%)]" />
      <div
        className="relative grid h-[178px] w-[178px] place-items-center rounded-full sm:h-[220px] sm:w-[220px]"
        style={{
          background: `conic-gradient(from 220deg, rgba(97,220,163,0.42) ${progressAngle}deg, rgba(97,220,163,0.06) ${progressAngle}deg 360deg)`,
        }}
      >
        <div className="absolute inset-[1px] rounded-full bg-black" />
        <div className="absolute inset-[10px] overflow-hidden rounded-full border border-[#1f5960]/70 bg-black shadow-[0_0_42px_rgba(97,220,163,0.12)]">
          <LetterGlitch
            className="opacity-35"
            glitchColors={['#173a34', '#2c7969', '#3b9bbd']}
            glitchSpeed={50}
            smooth
            outerVignette={false}
            centerVignette={false}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_34%,rgba(0,0,0,0.78)_74%),linear-gradient(rgba(0,0,0,0.36),rgba(0,0,0,0.36))]" />
        </div>
        <div className="pointer-events-none relative z-10 flex items-baseline gap-1 font-mono text-[1.65rem] leading-none text-[#c8fff2] drop-shadow-[0_0_18px_rgba(97,220,163,0.55)] sm:text-[2rem]">
          <span className="text-[#3bbdc5]">/</span>
          <span>{displayProgress}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  useHashAnchorScroll();
  const [heroVideoProgress, setHeroVideoProgress] = useState(0);
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [shouldLoadFeatureVideos, setShouldLoadFeatureVideos] = useState(false);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setShouldLoadFeatureVideos(true);
    }, 4500);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    let hasReleasedHero = false;

    const releaseHero = () => {
      if (hasReleasedHero) {
        return;
      }

      hasReleasedHero = true;
      setHeroVideoProgress(100);
      setIsHeroVideoReady(true);
      setShouldLoadFeatureVideos(true);
    };

    const inspectHeroVideo = () => {
      const heroVideo = document.querySelector<HTMLVideoElement>('#hero video');

      if (!heroVideo) {
        return;
      }

      if (heroVideo.readyState >= 2 || heroVideo.currentTime > 0) {
        releaseHero();
      }
    };

    inspectHeroVideo();
    const inspectTimer = window.setInterval(inspectHeroVideo, 250);
    const maximumWaitTimer = window.setTimeout(releaseHero, 10000);

    return () => {
      window.clearInterval(inspectTimer);
      window.clearTimeout(maximumWaitTimer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLoaderProgress((currentProgress) => {
        const targetProgress = isHeroVideoReady ? 100 : Math.max(heroVideoProgress, 88);
        const distance = targetProgress - currentProgress;

        if (distance <= 0) {
          return currentProgress;
        }

        const step = isHeroVideoReady ? Math.max(distance * 0.3, 3) : Math.max(distance * 0.045, 0.45);
        return Math.min(targetProgress, currentProgress + step);
      });
    }, 80);

    return () => {
      window.clearInterval(timer);
    };
  }, [heroVideoProgress, isHeroVideoReady]);

  useEffect(() => {
    if (heroVideoProgress < 100) {
      return;
    }

    setIsHeroVideoReady(true);
    setShouldLoadFeatureVideos(true);
  }, [heroVideoProgress]);

  return (
    <main className="bg-black text-primary">
      <LoadingIntro progress={loaderProgress} visible={loaderProgress < 99} />
      <Hero
        onVideoProgress={setHeroVideoProgress}
        onVideoReady={() => {
          setIsHeroVideoReady(true);
          setShouldLoadFeatureVideos(true);
        }}
      />
      <FeatureVideoWarmup enabled={shouldLoadFeatureVideos} />
      <About />
      <Features
        animationMode={firstFeatureAnimationMode}
        cards={workExperienceFeatures}
        canvasTitle="工作经历"
        headline="让 AI 不停留在概念里，而进入各行各业的日常流程。"
        shouldLoadVideo={shouldLoadFeatureVideos}
        showCardCta={false}
        showCardNumbers={false}
        videoSrc={siteMedia.featureVideos.workExperience}
      />
      <Features
        cards={projectExperienceFeatures}
        canvasTitle="项目经历"
        headline="每个 AI 项目，都是一次把混沌变成结构的实验。"
        layoutDirection="reverse"
        sectionId="features-copy-1"
        shouldLoadVideo={shouldLoadFeatureVideos}
        showCardCta={false}
        showCardNumbers={false}
        videoSrc={siteMedia.featureVideos.projectExperience}
      />
      <Features
        cards={dreamSceneFeatures}
        canvasTitle="造梦现场"
        featureDisplay="dream-squares"
        headline="每一个小作品，都是我把想象交给代码验证的现场。"
        sectionId="features-copy-2"
        shouldLoadVideo={shouldLoadFeatureVideos}
        videoSrc={siteMedia.featureVideos.dreamScene}
      />
    </main>
  );
}
