import React, { useState, useEffect, useCallback, useTransition } from "react";
import { Icon } from "@iconify/react";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { url } from "@utils/url-utils";
import type { SearchResult } from "@/global";

const SearchComponent: React.FC = () => {
  const [keywordDesktop, setKeywordDesktop] = useState("");
  const [keywordMobile, setKeywordMobile] = useState("");
  const [result, setResult] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagefindLoaded, setPagefindLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fakeResult: SearchResult[] = [
    {
      url: url("/"),
      meta: { title: "This Is a Fake Search Result" },
      excerpt:
        "Because the search cannot work in the <mark>dev</mark> environment.",
    },
    {
      url: url("/"),
      meta: { title: "If You Want to Test the Search" },
      excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
    },
  ];

  const togglePanel = () => {
    const panel = document.getElementById("search-panel");
    panel?.classList.toggle("float-panel-closed");
  };

  const setPanelVisibility = useCallback((show: boolean, isDesktop: boolean) => {
    const panel = document.getElementById("search-panel");
    if (!panel || !isDesktop) return;
    if (show) panel.classList.remove("float-panel-closed");
    else panel.classList.add("float-panel-closed");
  }, []);

  const search = useCallback(
    async (keyword: string, isDesktop: boolean) => {
      if (!keyword) {
        setPanelVisibility(false, isDesktop);
        setResult([]);
        return;
      }

      if (!initialized) return;

      setIsSearching(true);

      try {
        let searchResults: SearchResult[] = [];

        if (import.meta.env.PROD && pagefindLoaded && (window as any).pagefind) {
          const response = await (window as any).pagefind.search(keyword);
          searchResults = await Promise.all(
            response.results.map((item: any) => item.data())
          );
        } else if (import.meta.env.DEV) {
          searchResults = fakeResult;
        } else {
          searchResults = [];
          console.error("Pagefind is not available in production environment.");
        }

        startTransition(() => {
          setResult(searchResults);
          setPanelVisibility(searchResults.length > 0, isDesktop);
        });
      } catch (error) {
        console.error("Search error:", error);
        startTransition(() => {
          setResult([]);
          setPanelVisibility(false, isDesktop);
        });
      } finally {
        setIsSearching(false);
      }
    },
    [initialized, pagefindLoaded, setPanelVisibility]
  );

  // 初始化 Pagefind
  useEffect(() => {
    const initializeSearch = () => {
      setInitialized(true);
      const loaded =
        typeof window !== "undefined" &&
        !!(window as any).pagefind &&
        typeof (window as any).pagefind.search === "function";
      setPagefindLoaded(loaded);
      console.log("Pagefind status on init:", loaded);
      if (keywordDesktop) search(keywordDesktop, true);
      if (keywordMobile) search(keywordMobile, false);
    };

    if (import.meta.env.DEV) {
      console.log("Pagefind is not available in development mode. Using mock data.");
      initializeSearch();
    } else {
      document.addEventListener("pagefindready", () => {
        console.log("Pagefind ready event received.");
        initializeSearch();
      });
      document.addEventListener("pagefindloaderror", () => {
        console.warn(
          "Pagefind load error event received. Search functionality will be limited."
        );
        initializeSearch();
      });

      setTimeout(() => {
        if (!initialized) {
          console.log("Fallback: Initializing search after timeout.");
          initializeSearch();
        }
      }, 2000);
    }
  }, [initialized, keywordDesktop, keywordMobile, search]);

  // keywordDesktop 改变时触发搜索
  useEffect(() => {
    if (initialized && keywordDesktop) {
      search(keywordDesktop, true);
    }
  }, [keywordDesktop, initialized, search]);

  // keywordMobile 改变时触发搜索
  useEffect(() => {
    if (initialized && keywordMobile) {
      search(keywordMobile, false);
    }
  }, [keywordMobile, initialized, search]);

  return (
    <>
      {/* 搜索栏 - 桌面端 */}
      <div
        id="search-bar"
        className="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
          bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
          dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
      >
        <Icon
          icon="material-symbols:search"
          className="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"
        />
        <input
          placeholder={i18n(I18nKey.search)}
          value={keywordDesktop}
          onChange={(e) => setKeywordDesktop(e.target.value)}
          onFocus={() => search(keywordDesktop, true)}
          className="transition-all pl-10 text-sm bg-transparent outline-0
            h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
        />
      </div>

      {/* 切换按钮 - 移动端 */}
      <button
        onClick={togglePanel}
        aria-label="Search Panel"
        id="search-switch"
        className="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90"
      >
        <Icon icon="material-symbols:search" className="text-[1.25rem]" />
      </button>

      {/* 搜索面板 */}
      <div
        id="search-panel"
        className="float-panel float-panel-closed search-panel absolute md:w-[30rem]
          top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2"
      >
        {/* 移动端搜索栏 */}
        <div
          id="search-bar-inside"
          className="flex relative lg:hidden transition-all items-center h-11 rounded-xl
            bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
            dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
        >
          <Icon
            icon="material-symbols:search"
            className="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"
          />
          <input
            placeholder="Search"
            value={keywordMobile}
            onChange={(e) => setKeywordMobile(e.target.value)}
            className="pl-10 absolute inset-0 text-sm bg-transparent outline-0
              focus:w-60 text-black/50 dark:text-white/50"
          />
        </div>

        {/* 搜索结果 */}
        {isPending && (
          <div className="p-3 text-sm text-gray-400">Loading...</div>
        )}
        {result.map((item, index) => (
          <a
            key={index}
            href={item.url}
            className="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
              rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)]
              active:bg-[var(--btn-plain-bg-active)]"
          >
            <div className="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
              {item.meta.title}
              <Icon
                icon="fa6-solid:chevron-right"
                className="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"
              />
            </div>
            <div
              className="transition text-sm text-50"
              dangerouslySetInnerHTML={{ __html: item.excerpt }}
            />
          </a>
        ))}
      </div>

      <style>{`
        input:focus { outline: 0; }
        .search-panel { max-height: calc(100vh - 100px); overflow-y: auto; }
      `}</style>
    </>
  );
};

export default SearchComponent;
