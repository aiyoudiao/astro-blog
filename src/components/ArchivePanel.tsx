import React, { useState } from "react";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

interface Post {
  slug: string;
  data: {
    title: string;
    tags: string[];
    category?: string;
    published: Date;
  };
}

interface Group {
  year: number;
  posts: Post[];
}

interface Props {
  tags?: string[];
  categories?: string[];
  sortedPosts?: Post[];
}

export default function PostList({
  tags = [],
  categories = [],
  sortedPosts = [],
}: Props) {
  // React 19 — 使用懒初始化函数避免 useEffect 二次渲染
  const [groups] = useState<Group[]>(() => {
    const params = new URLSearchParams(window.location.search);
    const tagParams = params.has("tag") ? params.getAll("tag") : [];
    const categoryParams = params.has("category")
      ? params.getAll("category")
      : [];
    const uncategorized = params.get("uncategorized");

    let filteredPosts: Post[] = sortedPosts;

    if (tagParams.length > 0) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          Array.isArray(post.data.tags) &&
          post.data.tags.some((tag) => tagParams.includes(tag))
      );
    }

    if (categoryParams.length > 0) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.data.category && categoryParams.includes(post.data.category)
      );
    }

    if (uncategorized) {
      filteredPosts = filteredPosts.filter((post) => !post.data.category);
    }

    // 按年份分组
    const grouped = filteredPosts.reduce((acc, post) => {
      const year = post.data.published.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    }, {} as Record<number, Post[]>);

    return Object.keys(grouped)
      .map((yearStr) => ({
        year: Number.parseInt(yearStr),
        posts: grouped[Number.parseInt(yearStr)],
      }))
      .sort((a, b) => b.year - a.year);
  });

  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}`;
  };

  const formatTag = (tagList: string[]) =>
    tagList.map((t) => `#${t}`).join(" ");

  return (
    <div className="card-base px-8 py-6">
      {groups.map((group) => (
        <div key={group.year}>
          <div className="flex flex-row w-full items-center h-[3.75rem]">
            <div className="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
              {group.year}
            </div>
            <div className="w-[15%] md:w-[10%]">
              <div className="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto -outline-offset-[2px] z-50 outline-3"></div>
            </div>
            <div className="w-[70%] md:w-[80%] transition text-left text-50">
              {group.posts.length}{" "}
              {i18n(
                group.posts.length === 1
                  ? I18nKey.postCount
                  : I18nKey.postsCount
              )}
            </div>
          </div>

          {group.posts.map((post) => (
            <a
              key={post.slug}
              href={getPostUrlBySlug(post.slug)}
              aria-label={post.data.title}
              className="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
            >
              <div className="flex flex-row justify-start items-center h-full">
                {/* date */}
                <div className="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                  {formatDate(post.data.published)}
                </div>

                {/* dot and line */}
                <div className="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                  <div className="transition-all mx-auto w-1 h-1 rounded group-hover:h-5 bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)] outline outline-4 z-50 outline-[var(--card-bg)] group-hover:outline-[var(--btn-plain-bg-hover)] group-active:outline-[var(--btn-plain-bg-active)]"></div>
                </div>

                {/* post title */}
                <div className="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)] text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden">
                  {post.data.title}
                </div>

                {/* tag list */}
                <div className="hidden md:block md:w-[15%] text-left text-sm transition whitespace-nowrap overflow-ellipsis overflow-hidden text-30">
                  {formatTag(post.data.tags)}
                </div>
              </div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
