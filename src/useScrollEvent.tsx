import { createContext, useContext, useEffect, useRef } from "react";

/**
 * @params offset スクロール量
 */
type ScrollEventProp = {
  offset: number;
};

const ScrollEventContext = createContext<ScrollEventProp>({
  offset: 0,
} as ScrollEventProp);

/**
 * カスタムフック
 * @description 外部コンポネントからスクロール量を情報を取得するときに利用
 */
export const useScrollEvent = () => useContext(ScrollEventContext);

/**
 * スクロール量を検知するProvider
 * @param children
 * @param fireTime スクロールが止まったことを検知するまでの時間
 */
export const ScrollEventProvider = ({
  children,
  fireTime = 1000,
}: {
  children: React.ReactNode;
  fireTime?: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);

  // 0~1でスクロールの割合を保持
  const offset = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      // Offsetの計算
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        offset.current = scrollTop / (scrollHeight - clientHeight);
      }

      // スクロールして止まった1秒後に実行
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        // TODO: スクロールが止まったことを検知
        console.log("スクロールが止まった: ", offset.current);
      }, fireTime);
    };
    // スクロールイベントの登録
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <ScrollEventContext.Provider
      value={{
        offset: offset.current,
      }}
    >
      <div
        className="overflow-y-auto h-full w-full"
        ref={scrollRef}
      >
        {children}
      </div>
    </ScrollEventContext.Provider>
  );
};
