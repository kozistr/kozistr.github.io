/* eslint-disable @typescript-eslint/no-explicit-any */

import { graphql } from 'gatsby'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import Layout from '../components/Layout'
import PostList from '../components/PostList'
import SEO from '../components/seo'

import './styles/tags.scss'

interface TagsPageProps {
  data: any
}

interface groupItem {
  fieldValue: string
  totalCount: number
  edges: any[]
}

const TagsComponent: React.FC<TagsPageProps> = ({ data }) => {
  const { group } = data.allMarkdownRemark

  const sortedGroup = useMemo(() => {
    return group.sort((a: groupItem, b: groupItem) => {
      const x = a.fieldValue.toLocaleLowerCase()
      const y = b.fieldValue.toLocaleLowerCase()

      return x.localeCompare(y)
    })
  }, [group])

  const [largeCount, setLargeCount] = useState(0)
  const [targetTag, setTargetTag] = useState<string | undefined>(() => {
    return typeof window !== 'undefined' && window.location.hash ? window.location.hash.split('#')[1] : undefined
  })

  useEffect(() => {
    const large = sortedGroup.reduce((max: number, g: { totalCount: number }) => Math.max(max, g.totalCount), 0)
    setLargeCount(large)
  }, [sortedGroup])

  const getFontSize = useCallback(
    (totalCount: number) => {
      const fontSize = Math.max(50 / (largeCount / totalCount), 10)
      return `${fontSize / 100 + 0.9}rem`
    },
    [largeCount]
  )

  const tagList = useMemo(() => {
    return sortedGroup.map((g: groupItem) => (
      <li key={g.fieldValue}>
        <span
          className="tag-text"
          style={{
            fontSize: g.fieldValue !== 'undefined' ? getFontSize(g.totalCount) : '0.9rem',
            opacity: g.fieldValue === targetTag ? '0.9' : '0.5',
            fontWeight: g.fieldValue === targetTag ? 'bold' : 'normal',
          }}
          onClick={() => setTargetTag(g.fieldValue)}
        >
          <a href={`#${g.fieldValue}`}>{g.fieldValue}</a>
        </span>
      </li>
    ))
  }, [sortedGroup, getFontSize, targetTag])

  const currentPostList = useMemo(() => {
    const tagGroup =
      sortedGroup.find((g: groupItem) => g.fieldValue === targetTag) ||
      sortedGroup.find((g: groupItem) => g.fieldValue === 'undefined')
    return tagGroup ? tagGroup.edges : []
  }, [sortedGroup, targetTag])

  return (
    <Layout>
      <SEO title="Tags" />
      <div id="tags">
        <div className="tag-list-wrap">
          <ul>{tagList}</ul>
        </div>
        <PostList posts={currentPostList} />
      </div>
    </Layout>
  )
}

const Tags = memo(TagsComponent)

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
        edges {
          node {
            excerpt(truncate: true, format: PLAIN)
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMM DD, YYYY")
              update(formatString: "MMM DD, YYYY")
              title
              tags
            }
            timeToRead
          }
        }
      }
    }
  }
`

export default Tags
