/* eslint-disable @typescript-eslint/no-explicit-any */

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { graphql } from 'gatsby'
import React, { useEffect, useState } from 'react'

import Layout from '../components/Layout'
import PostList from '../components/PostList'
import SEO from '../components/seo'

import './styles/search.scss'

interface SearchProps {
  data: any
}

const Search: React.FC<SearchProps> = ({ data }) => {
  const {
    allMarkdownRemark: { edges: posts },
  } = data

  const [value, setValue] = useState('')
  const [isTitleOnly, setIsTitleOnly] = useState(true)
  const [filteredPosts, setFilteredPosts] = useState(posts)

  useEffect(() => {
    const lowerValue = value.toLowerCase()

    const result = posts.filter(({ node }: any) => {
      const { frontmatter, rawMarkdownBody } = node
      const { title } = frontmatter

      if (!isTitleOnly && rawMarkdownBody.toLowerCase().includes(lowerValue)) {
        return true
      }

      return title.toLowerCase().includes(lowerValue)
    })

    setFilteredPosts(result)
  }, [value, isTitleOnly, posts])

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
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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
