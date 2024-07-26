/* eslint-disable @typescript-eslint/no-explicit-any */

import { faAngleLeft, faLayerGroup, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { Link, Script, graphql } from 'gatsby'
import { throttle } from 'lodash'
import moment from 'moment'
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import AdSense from 'react-adsense'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import { useColorMode } from 'theme-ui'

import './post.scss'
import './code-theme.scss'
import './md-style.scss'
import 'katex/dist/katex.min.css'

import config from '../../config'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import Toc from '../components/Toc'
import { RootState } from '../state/reducer'

interface postProps {
  data: any
  pageContext: { slug: string; series: any[]; lastmod: string }
}

interface iConfig {
  enablePostOfContents: boolean
  enableSocialShare: boolean
  repoId: string
  disqusShortname?: string
}

const Comment = React.lazy(() => import('../components/Comment'))

const Post: React.FC<postProps> = ({ data, pageContext }) => {
  const isSSR = typeof window === 'undefined'
  const isMobile = useSelector((state: RootState) => state.isMobile)
  const [yList, setYList] = useState([] as number[])
  const [isInsideToc, setIsInsideToc] = useState(false)
  const [commentEl, setCommentEl] = useState<JSX.Element | null>(null)
  const [colorMode] = useColorMode()

  const { markdownRemark } = data
  const { frontmatter, html, tableOfContents, fields, excerpt, timeToRead } = markdownRemark
  const { title, date, tags, keywords, update } = frontmatter
  const { slug } = fields
  const { series } = pageContext
  const { enablePostOfContents, enableSocialShare, repoId }: iConfig = config

  const isTableOfContents = useMemo(
    () => enablePostOfContents && tableOfContents !== '',
    [enablePostOfContents, tableOfContents]
  )
  const isSocialShare = enableSocialShare

  const updatedDate = Number(update?.split(',')[1]) === 1 ? null : update

  const mapTags = useMemo(
    () =>
      tags.map((tag: React.Key | null | undefined) => (
        <li key={tag} className="blog-post-tag">
          <Link to={`/tags#${tag}`}>{`#${tag}`}</Link>
        </li>
      )),
    [tags]
  )

  const mapSeries = useMemo(
    () =>
      series.map(s => (
        <li key={`${s.slug}-series-${s.num}`} className={`series-item ${slug === s.slug ? 'current-series' : ''}`}>
          <Link to={s.slug}>
            <span>{s.title}</span>
            <div className="icon-wrap">{slug === s.slug ? <Fa icon={faAngleLeft} /> : null}</div>
          </Link>
        </li>
      )),
    [series, slug]
  )

  const metaKeywords = useCallback((keywordList: string[], tagList: string[]) => {
    return Array.from(new Set([...keywordList, ...tagList]))
  }, [])

  useEffect(() => {
    if (isMobile) {
      const adDiv = document.querySelector('.ad') as HTMLDivElement

      if (adDiv) {
        const maxWidth = Math.min(window.innerHeight, window.innerWidth)
        adDiv.style.maxWidth = `${maxWidth}px`
        adDiv.style.display = 'flex'
        adDiv.style.justifyContent = 'flex-end'
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (isTableOfContents) {
      const handleScroll = throttle(() => {
        if (yList.length > 0) {
          const index = yList.filter(v => v < window.scrollY).length - 1
          const aList = document.querySelectorAll('.toc.outside li a') as NodeListOf<HTMLAnchorElement>
          aList.forEach((a, i) => {
            a.style.opacity = i === index ? '1' : '0.4'
          })
        }
      }, 250)

      document.addEventListener('scroll', handleScroll)
      return () => document.removeEventListener('scroll', handleScroll)
    }
  }, [yList, isTableOfContents])

  useEffect(() => {
    setCommentEl(null)
    setTimeout(() => setCommentEl(<Comment />), 1000)
  }, [colorMode])

  useEffect(() => {
    const postContent = document.querySelector('.blog-post')
    const postContentOriginTop = postContent?.getBoundingClientRect().top ?? 0
    const renderCondition = window.scrollY + window.innerHeight * 1.75 - postContentOriginTop

    const handleScroll = throttle(() => {
      const postContentHeight = postContent?.getBoundingClientRect().height ?? Infinity
      if (renderCondition > postContentHeight) setCommentEl(<Comment />)
    }, 250)

    if (postContent) {
      document.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    const headings = Array.from(document.querySelectorAll('h2, h3')) as HTMLHeadingElement[]
    const minusValue = window.innerHeight < 500 ? 100 : Math.floor(window.innerHeight / 5)
    const yPositions = headings.map(h => h.offsetTop - minusValue)
    setYList(yPositions)

    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Helmet>
        <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        <Script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "datePublished": "${moment(new Date(date)).toISOString()}",
              ${updatedDate ? `"dateModified": "${moment(new Date(update)).toISOString()}",` : ''}
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "${config.siteUrl}"
              },
              "author": {
                "@type": "Person",
                "name": "${config.name}"
              },
              "headline": "${title}",
              ${
                config.profileImageFileName
                  ? `"publisher": {
                "@type" : "organization",
                "name" : "${config.name}",
                "logo": {
                  "@type": "ImageObject",
                  "url": "${config.siteUrl}${require(`../images/${config.profileImageFileName}`)}" // eslint-disable-line @typescript-eslint/no-require-imports
                }
              },
              "image": ["${config.siteUrl}${require(`../images/${config.profileImageFileName}`)}"]` // eslint-disable-line @typescript-eslint/no-require-imports
                  : `"publisher": {
                "@type" : "organization",
                "name" : "${config.name}"
              },
              "image": []`
              }
            }
          `}
        </Script>
      </Helmet>

      <SEO title={title} description={excerpt} keywords={metaKeywords(keywords, tags)} />

      <Layout>
        <div className="blog-post-container">
          <div className="blog-post">
            <div className="date-wrap">
              <span className="write-date">
                {date} • {timeToRead} min read ☕
              </span>
              <span> </span>
              {updatedDate ? (
                <>
                  <span>(</span>
                  <span className="update-date">{`Last updated: ${updatedDate}`}</span>
                  <span>)</span>
                </>
              ) : null}
            </div>
            <h1 className="blog-post-title">{title}</h1>

            <div className="blog-post-info">
              {tags.length > 0 && tags[0] !== 'undefined' ? (
                <>
                  <span className="dot">·</span>
                  <ul className="blog-post-tag-list">{mapTags}</ul>
                </>
              ) : null}

              {isTableOfContents && (
                <div className="blog-post-inside-toc">
                  <div className="toc-button" role="button" onClick={() => setIsInsideToc(!isInsideToc)}>
                    <Fa icon={faListUl} />
                  </div>
                </div>
              )}
            </div>

            {isTableOfContents && (
              <div className="inside-toc-wrap" style={{ display: isInsideToc ? 'flex' : 'none' }}>
                <Toc isOutside={false} toc={tableOfContents} />
              </div>
            )}

            {series.length > 1 ? (
              <>
                <div className="series">
                  <div className="series-head">
                    <span className="head">Post Series</span>
                    <div className="icon-wrap">
                      <Fa icon={faLayerGroup} />
                    </div>
                  </div>
                  <ul className="series-list">{mapSeries}</ul>
                </div>
              </>
            ) : null}

            <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {isSocialShare ? (
            <div className="social-share">
              <ul>
                <li className="social-share-item email">
                  <EmailShareButton url={config.siteUrl + slug}>
                    <EmailIcon size={24} round={true} />
                  </EmailShareButton>
                </li>
                <li className="social-share-item facebook">
                  <FacebookShareButton url={config.siteUrl + slug}>
                    <FacebookIcon size={24} round={true} />
                  </FacebookShareButton>
                </li>
                <li className="social-share-item twitter">
                  <TwitterShareButton url={config.siteUrl + slug}>
                    <TwitterIcon size={24} round={true} />
                  </TwitterShareButton>
                </li>
                <li className="social-share-item linkedin">
                  <LinkedinShareButton url={config.siteUrl + slug}>
                    <LinkedinIcon size={24} round={true} />
                  </LinkedinShareButton>
                </li>
                <li className="social-share-item reddit">
                  <RedditShareButton url={config.siteUrl + slug}>
                    <RedditIcon size={24} round={true} />
                  </RedditShareButton>
                </li>
                <li className="social-share-item pocket">
                  <PocketShareButton url={config.siteUrl + slug}>
                    <PocketIcon size={24} round={true} />
                  </PocketShareButton>
                </li>
              </ul>
            </div>
          ) : null}

          {process.env.NODE_ENV === 'development' ? (
            <>
              <aside className="ad ad-dev">
                <span>Ads</span>
                <span>displayed when you deploy</span>
              </aside>
              {repoId ? (
                <div className="comments comments-dev">
                  <span>Comments</span>
                  <span>displayed when you deploy</span>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <aside className="ad">
                <AdSense.Google
                  client={config.googleAdsenseClient || 'ca-pub-7954241517411559'}
                  slot={config.googleAdsenseSlot || '5214956675'}
                  style={{ display: 'block' }}
                  format="auto"
                  responsive="true"
                />
              </aside>

              {!isSSR ? <Suspense fallback={<></>}>{commentEl}</Suspense> : null}
            </>
          )}
        </div>

        {isTableOfContents && <Toc isOutside={true} toc={tableOfContents} />}
      </Layout>
    </>
  )
}

export const pageQuery = graphql`
  query ($slug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(truncate: true, format: PLAIN)
      tableOfContents
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
        tags
        keywords
        update(formatString: "MMM DD, YYYY")
      }
      timeToRead
    }
  }
`

export default Post
