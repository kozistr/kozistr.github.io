/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from 'gatsby'
import { throttle } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import './postList.scss'

interface PostNode {
  node: {
    excerpt: string
    fields: {
      slug: string
    }
    frontmatter: {
      date: string
      title: string
      tags: string[]
      update?: string
    }
    timeToRead: number
  }
}

export interface PostListProps {
  posts: PostNode[]
}

// eslint-disable-next-line react/prop-types
const Tag: React.FC<{ tag: string; slug: string }> = memo(({ tag, slug }) => {
  if (tag === 'undefined') return null

  return (
    <li key={`${slug}-${tag}`} className="tag">
      <span>
        <Link to={`/tags#${tag}`} className="link">{`#${tag}`}</Link>
      </span>
    </li>
  )
})

// eslint-disable-next-line react/prop-types
const PostList: React.FC<PostListProps> = memo(({ posts }) => {
  const [showCnt, setShowCnt] = useState(10)

  const sortedPosts = useMemo(
    () =>
      // eslint-disable-next-line react/prop-types
      posts.sort((a, b) => {
        const aDate = new Date(a.node.frontmatter.update ?? a.node.frontmatter.date)
        const bDate = new Date(b.node.frontmatter.update ?? b.node.frontmatter.date)

        return bDate.getTime() - aDate.getTime()
      }),
    [posts]
  )

  const throttleScrollHandler = useCallback(
    throttle(() => {
      if (window.outerHeight + window.scrollY > document.body.offsetHeight) {
        // eslint-disable-next-line react/prop-types
        setShowCnt(prev => (prev >= posts.length ? prev : prev + 10))
      }
    }, 250),
    // eslint-disable-next-line react/prop-types
    [posts.length]
  )

  useEffect(() => {
    window.addEventListener('scroll', throttleScrollHandler)

    return () => {
      window.removeEventListener('scroll', throttleScrollHandler)
    }
  }, [throttleScrollHandler])

  const mapPost = sortedPosts.map((post: any, i: number) => {
    const { node } = post
    const { excerpt, fields, frontmatter, timeToRead } = node
    const { slug } = fields
    const { date, title, tags } = frontmatter

    let update = frontmatter.update
    if (Number(update?.split(',')[1]) === 1) update = null

    return (
      <li key={slug} className={`post ${i < showCnt ? 'show' : 'hide'}`}>
        <div className="date">
          <small>
            {date} • {timeToRead} min read ☕
          </small>
        </div>
        <article>
          <h2 className="title">
            <Link to={slug} className="link">
              {title}
            </Link>
          </h2>
          <div className="info">
            <ul className="tag-list">
              {tags.map((tag: string) => (
                <Tag key={tag} tag={tag} slug={slug} />
              ))}
            </ul>
          </div>
          <span className="excerpt">
            <Link to={slug} className="link">
              {excerpt}
            </Link>
          </span>
        </article>
      </li>
    )
  })

  return (
    <div className="post-list">
      <ul>{mapPost}</ul>
    </div>
  )
})

export default PostList
