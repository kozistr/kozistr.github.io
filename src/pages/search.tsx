/* eslint-disable @typescript-eslint/no-explicit-any */

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { graphql } from 'gatsby'
import React, { useMemo, useState } from 'react'

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

  const filteredPosts = useMemo(() => {
    const lowerValue = value.toLowerCase()
    return posts.filter(({ node }: any) => {
      const { frontmatter, rawMarkdownBody } = node
      const { title } = frontmatter
      return (
        (!isTitleOnly && rawMarkdownBody.toLowerCase().includes(lowerValue)) || title.toLowerCase().includes(lowerValue)
      )
    })
  }, [value, isTitleOnly, posts])

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }

  const handleToggleClick = (titleOnly: boolean) => {
    setIsTitleOnly(titleOnly)
  }

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
              onChange={handleInputChange}
            />
            <SearchToggle isTitleOnly={isTitleOnly} onToggle={handleToggleClick} />
          </div>
          {value && !filteredPosts.length && <span className="no-result">No search results</span>}
          <PostList posts={value ? filteredPosts : posts} />
        </div>
      </div>
    </Layout>
  )
}

const SearchToggle: React.FC<{ isTitleOnly: boolean; onToggle: (titleOnly: boolean) => void }> = ({
  isTitleOnly,
  onToggle,
}) => {
  return (
    <div className="search-toggle">
      <span style={{ opacity: isTitleOnly ? 0.8 : 0.15 }} onClick={() => onToggle(true)}>
        in Title
      </span>
      <span style={{ opacity: !isTitleOnly ? 0.8 : 0.15 }} onClick={() => onToggle(false)}>
        in Title+Content
      </span>
    </div>
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
