import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR, { useSWRInfinite } from "swr";
import PostCard from "../components/PostCard";
import { useAuthState } from "../context/auth";
import { ISub, Post } from "../typings/types";

const description = "This is a clone of reddit not the real thing";
const title = "leddit: the front page of uhmmmm";

export default function Home() {
  const [observedPost, setObservedPost] = useState("");

  const { data: topSubs } = useSWR<ISub[]>("/subs/top/subs");
  const { authenticated } = useAuthState();
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`, {
    revalidateAll: true,
  });

  const isInitialLoading = !data && !error;

  const posts: Post[] = data ? [].concat(...(data as any)) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("Reached bottom of post", entries);
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  useEffect(() => {
    revalidate();
  }, [revalidate, authenticated]);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={title} />
      </Head>
      <div className="container flex pt-5 ">
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && <p className="text-lg text-center">Loading..</p>}
          {posts?.map((post) => (
            <PostCard
              key={post.identifier}
              post={post}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading More..</p>
          )}
        </div>
        <div className="hidden ml-6 md:block w-80">
          <div className="w-full bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top communities
              </p>
            </div>
          </div>
          {topSubs?.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs bg-white border-b"
            >
              <Link href={`/r/${sub.name}`}>
                <a>
                  <img
                    src={sub.imageUrl}
                    alt="Sub"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                </a>
              </Link>
              <Link href={`/r/${sub.name}`}>
                <a className="ml-2 font-bold hover:cursor-pointer">
                  /r/{sub.name}
                </a>
              </Link>
              <p className="ml-auto font-med">{sub.postCount}</p>
            </div>
          ))}
        </div>
        {authenticated && (
          <div className="p-4 border-t-2">
            <Link href="/subs/create">
              <a className="w-full px-2 py-1 blue button">Create Community</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
