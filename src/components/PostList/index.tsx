import * as React from 'react';
import { memo, useEffect, useState, useCallback } from 'react';
import { Link } from 'gatsby';
import { throttle } from 'lodash';

import './postList.scss';

export interface PostListProps {
  posts: any[];
}

const PostList = memo((props: PostListProps) => {
  const { posts } = props;
  const [showCnt, setShowCnt] = useState(10);

  const throttleScrollHandler = useCallback(
    throttle(() => {
      if (
        window.outerHeight > (document.querySelector('.post-list') as HTMLDivElement).getBoundingClientRect().bottom
      ) {
        setShowCnt((prev: number) => {
          if (prev >= posts.length) return prev;
          return prev + 10;
        });
      }
    }, 250),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', throttleScrollHandler);

    return () => {
      window.removeEventListener('scroll', throttleScrollHandler);
    };
  }, []);

  posts.sort((a: any, b: any) => {
    const aDate = new Date(a.node.frontmatter.update ?? a.node.frontmatter.date);
    const bDate = new Date(b.node.frontmatter.update ?? b.node.frontmatter.date);

    if (aDate < bDate) return 1;
    if (aDate > bDate) return -1;
    return 0;
  });

  const mapPost = posts.map((post: any, i: number) => {
    const { node } = post;
    const { excerpt, fields, frontmatter } = node;
    const { slug } = fields;
    const { date, title, tags } = frontmatter;
    const {timeToRead} = node;
    console.log(node);
    let update = frontmatter.update;
    if (Number(update.split(',')[1]) === 1) update = null;

    const mapTag = tags.map((tag: string) => {
      if (tag === 'undefined') return;

      return (
        <li key={`${slug}-${tag}`} className="tag">
          <span>
            <Link to={`/tags#${tag}`} className="link">{`#${tag}`}</Link>
          </span>
        </li>
      );
    });

    return (
      <li key={slug} className={`post ${i < showCnt ? 'show' : 'hide'}`}>
        <div className="date">
          <small> {date} •{timeToRead} min read  ☕ </small>
        </div>
        <article>
          <h2 className="title">
            <Link to={slug} className="link">{title}</Link>
          </h2>
          <div className="info">
            <ul className="tag-list">{mapTag}</ul>
          </div>
          <span className="excerpt">
            <Link to={slug} className="link">{excerpt}</Link>
          </span>
        </article>
      </li>
    );
  });
  return (
    <div className="post-list">
      <ul>{mapPost}</ul>
    </div>
  );
});

export default PostList;
