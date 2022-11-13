/* eslint-disable @typescript-eslint/no-explicit-any */

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { graphql } from 'gatsby'
import * as React from 'react'
import { useCallback, useState } from 'react'

import Layout from '../components/Layout'
import PostList from '../components/PostList'
import SEO from '../components/seo'

import './styles/search.scss'

interface SearchProps {
  data: any
}

const Search = (props: SearchProps) => {
  const { data } = props
  const posts = data.allMarkdownRemark.edges

  const [value, setValue] = useState('')
  const [isTitleOnly, setIsTitleOnly] = useState(true)

  const filteredPosts = useCallback(
    posts.filter((post: any) => {
      const { node } = post
      const { frontmatter, rawMarkdownBody } = node
      const { title } = frontmatter
      const lowerValue = value.toLocaleLowerCase()

      if (!isTitleOnly && rawMarkdownBody.toLocaleLowerCase().includes(lowerValue)) return true

      return title.toLocaleLowerCase().includes(lowerValue)
    }),
    [value, isTitleOnly]
  )

  return (
    <Layout>
      <SEO title="Search" />
      <div id="Search">
        <div className="search-inner-wrap">
          <div className="input-wrap">
            <Fa icon={faSearch} />
            <input
              type="text"
              name="search"
              id="searchInput"
              value={value}
              placeholder="Search"
              autoComplete="off"
              autoFocus
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setValue(e.currentTarget.value)
              }}
            />
            <div className="search-toggle">
              <span
                style={{ opacity: isTitleOnly ? 0.8 : 0.15 }}
                onClick={() => {
                  setIsTitleOnly(true)
                }}
              >
                in Title
              </span>
              <span
                style={{ opacity: !isTitleOnly ? 0.8 : 0.15 }}
                onClick={() => {
                  setIsTitleOnly(false)
                }}
              >
                in Title+Content
              </span>
            </div>
          </div>

          {value !== '' && !filteredPosts.length ? <span className="no-result">No search results</span> : null}
          <PostList posts={value === '' ? posts : filteredPosts} />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          rawMarkdownBody
          excerpt(truncate: true, format: PLAIN)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            title
            tags
            update(formatString: "MMM DD, YYYY")
          }
          timeToRead
        }
      }
    }
  }
`

export default Search
