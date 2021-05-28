import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ISub, Post } from "../../../typings/types";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import Head from "next/head";
import { GetServerSideProps } from "next";

const Submit = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<ISub>(
    subName ? `/subs/${subName}` : null
  );
  if (error) router.push("/");

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === "") return;

    try {
      const { data: post } = await axios.post<Post>("/posts", {
        title: title.trim(),
        body,
        sub: sub?.name,
      });

      router.push(`/r/${sub?.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to readit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 break-words break-all border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{
                  top: 11,
                  right: 10,
                }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Text (optional)"
              rows={4}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub!} />}
    </div>
  );
};

export default Submit;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie) {
      res.writeHead(307, { Location: "/login" }).end();
    }

    await axios.get("/auth/me", { headers: { cookie } });
    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
