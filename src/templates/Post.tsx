import * as React from 'react';
import { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { graphql, Link } from 'gatsby';
import { DiscussionEmbed } from 'disqus-react';
import moment, { HTML5_FMT } from 'moment';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faListUl, faLayerGroup, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import AdSense from 'react-adsense';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  RedditShareButton,
  PocketShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
  PocketIcon,
  EmailIcon,
} from 'react-share';

import Layout from '../components/Layout';
import Toc from '../components/Toc';
import SEO from '../components/seo';

import 'katex/dist/katex.min.css';
import './code-theme.scss';
import './post.scss';

const config = require('../../config');

export interface postProps {
  data: any;
  pageContext: { slug: string; series: any[]; lastmod: string };
  isMobile: boolean;
}

const Post = (props: postProps) => {
  const { data, pageContext, isMobile } = props;
  const { markdownRemark } = data;
  const { frontmatter, html, tableOfContents, fields, excerpt } = markdownRemark;
  const { title, date, tags, keywords, thumbnail } = frontmatter;
  const { timeToRead } = markdownRemark;
  let update = frontmatter.update;
  if (Number(update?.split(',')[1]) === 1) update = null;
  const { slug } = fields;
  const { series } = pageContext;

  interface iConfig {
    enablePostOfContents: boolean;
    enableSocialShare: boolean;
    disqusShortname?: string;
  }
  const { enablePostOfContents, disqusShortname, enableSocialShare }: iConfig = config;

  const [yList, setYList] = useState([] as number[]);
  const [isInsideToc, setIsInsideToc] = useState(false);

  const isTableOfContents = enablePostOfContents && tableOfContents !== '';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDisqus: boolean = disqusShortname ? true : false;
  const isSocialShare = enableSocialShare;

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
    const minusValue = window.innerHeight < 500 ? 100 : Math.floor(window.innerHeight / 5);
    const yPositions = hs.map(h => h.offsetTop - minusValue);
    setYList(yPositions);

    return () => { };
  }, []);

  useEffect(() => {
    if (isMobile) {
      const adDiv = document.querySelector('.ad') as HTMLDivElement;

      if (adDiv) {
        const maxWidth = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
        adDiv.style.maxWidth = `${maxWidth}px`;
        adDiv.style.display = 'flex';
        adDiv.style.justifyContent = 'flex-end';
      }
    }
  }, [isMobile]);

  useEffect(() => {
    const setYPos = () => {
      if (yList) {
        const index =
          yList.filter((v: number) => {
            return v < window.pageYOffset;
          }).length - 1;

        const aList = document.querySelectorAll('.toc.outside li a') as NodeListOf<HTMLAnchorElement>;

        for (const i in Array.from(aList)) {
          if (parseInt(i, 10) === index) {
            aList[i].style.opacity = '1';
          } else {
            aList[i].style.opacity = '0.4';
          }
        }
      }
    };

    if (isTableOfContents) document.addEventListener('scroll', setYPos);
    return () => {
      if (isTableOfContents) document.removeEventListener('scroll', setYPos);
    };
  }, [yList]);

  const mapTags = tags.map((tag: string) => {
    return (
      <li key={tag} className="blog-post-tag">
        <Link to={`/tags#${tag}`}>{`#${tag}`}</Link>
      </li>
    );
  });

  const mapSeries = series.map((s: any) => {
    return (
      <li key={`${s.slug}-series-${s.num}`} className={`series-item ${slug === s.slug ? 'current-series' : ''}`}>
        <Link to={s.slug}>
          <span>{s.title}</span>
          <div className="icon-wrap">{slug === s.slug ? <Fa icon={faAngleLeft} /> : null}</div>
        </Link>
      </li>
    );
  });

  //disqus
  const disqusConfig = {
    shortname: config.disqusShortname,
    config: {
      url: `${config.siteUrl + slug}`,
      identifier: slug,
      title,
    },
  };

  const metaKeywords: (keywordList: string[], tagList: string[]) => string[] = (
    keywordList: string[],
    tagList: string[]
  ) => {
    const resultKeywords = new Set();

    for (const v of [...keywordList, ...tagList]) {
      resultKeywords.add(v);
    }

    return Array.from(resultKeywords) as string[];
  };

  return (
    <>
      <Helmet>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <script type="application/ld+json">
          {`
{
  "@context": "https://schema.org",
  "@type": "Article",
  "datePublished": "${moment(new Date(date)).toISOString()}",
  ${update ? `"dateModified": "${moment(new Date(update)).toISOString()}",` : ''}
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
            config.ogImageFileName
              ? `"publisher": {
    "@type" : "organization",
    "name" : "${config.name}",
    "logo": {
      "@type": "ImageObject",
      "url": "${config.siteUrl}${require(`../images/${config.ogImageFileName}`)}"
    }
  },
  "image": ["${config.siteUrl}${require(`../images/${config.ogImageFileName}`)}"]`
              : `"publisher": {
    "@type" : "organization",
    "name" : "${config.name}"
  },
  "image": []`
            }
}
`}
        </script>
      </Helmet>

      <SEO
        title={title}
        description={excerpt}
        keywords={metaKeywords(keywords, tags)}
        thumbnail={thumbnail}
      />

      <Layout>
        <div className="blog-post-container">
          <div className="blog-post">
            <div className="date-wrap">
              <span className="write-date">{date} •{timeToRead} min read  ☕</span>
              {update ? (
                <>
                  <span>(</span>
                  <span className="update-date">{`Last updated: ${update}`}</span>
                  <span>)</span>
                </>
              ) : null}
            </div>
            <h1 className="blog-post-title">{title}</h1>

            <div className="blog-post-info">

              {tags.length && tags[0] !== 'undefined' ? (
                <>
                  <ul className="blog-post-tag-list">{mapTags}</ul>
                </>
              ) : null}

              {!isTableOfContents ? null : (
                <div className="blog-post-inside-toc">
                  <div
                    className="toc-button"
                    role="button"
                    onClick={() => {
                      setIsInsideToc((prev: boolean) => {
                        return !prev;
                      });
                    }}
                  >
                    <Fa icon={faListUl} />
                  </div>
                </div>
              )}
            </div>

            {!isTableOfContents ? null : (
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

          {isDevelopment ? (
            <>
              <aside className="ad ad-dev">
                <span>Ads</span>
                <span>displayed when you deploy</span>
              </aside>
              {isDisqus ? (
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
                    client={config.googleAdsenseClient || 'ca-pub-1867053081376792'}
                    slot={config.googleAdsenseSlot || '1007605629'}
                    style={{ display: 'block' }}
                    format="auto"
                    responsive="true"
                  />
                </aside>

                {isDisqus ? (
                  <div className="comments">
                    <DiscussionEmbed {...disqusConfig} />
                  </div>
                ) : null}
              </>
            )}
        </div>

        {!isTableOfContents ? null : <Toc isOutside={true} toc={tableOfContents} />}
      </Layout>
    </>
  );
};

export const pageQuery = graphql`
  query($slug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt
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
`;

const mapStateToProps = ({ isMobile }: { isMobile: boolean }) => {
  return { isMobile };
};

export default connect(mapStateToProps)(Post);
