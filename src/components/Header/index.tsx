import { faChevronRight, faMoon, faSearch, faSun, faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { Link } from 'gatsby'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useColorMode } from 'theme-ui'

import './header.scss'
import config from '../../../config'
import { actionCreators } from '../../state/actions'
import { RootState } from '../../state/reducer'

interface HeaderProps {
  siteTitle: string
}

const Header: React.FC<HeaderProps> = ({ siteTitle }) => {
  const { isMobile, path, size } = useSelector((state: RootState) => state)
  const [, setYPos] = useState(0)
  const [isHide, setIsHide] = useState(false)
  const dispatch = useDispatch()
  const [colorMode, setColorMode] = useColorMode()
  const imageSize = size ?? '25px'

  const bioRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)

  const toggleTheme = useCallback(() => {
    const ms = 300
    const transition = `top 0.3s ease 0.2s, background-color ${ms}ms`

    document.body.style.transition = `background-color ${ms}ms`
    if (headerRef.current) headerRef.current.style.transition = transition

    if (colorMode === 'dark') {
      setColorMode('default')
    } else {
      setColorMode('dark')
    }

    setTimeout(() => {
      document.body.style.transition = 'none'
      if (headerRef.current) headerRef.current.style.transition = transition
    }, ms + 100)
  }, [colorMode, setColorMode])

  const setPath = useCallback((path: string, size?: string) => dispatch(actionCreators.setPath(path, size)), [dispatch])

  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.opacity = isHide ? '0' : '1'
      bioRef.current.style.pointerEvents = isHide ? 'none' : 'all'
    }
  }, [isHide])

  useEffect(() => {
    const profile: HTMLImageElement | null = document.querySelector('.header-profile-image-wrap>img')

    const prevPath: string = path
    const currPath: string = location.pathname

    if (profile) {
      if (currPath === prevPath) setPath(location.pathname, currPath !== '/' ? '25px' : '50px')
      if (prevPath !== '/' && currPath === '/') setPath(location.pathname, '50px')
      if (prevPath === '/' && currPath !== '/') setPath(location.pathname, '25px')
      if (prevPath !== '/' && currPath !== '/') setPath(location.pathname)
    } else {
      setPath(location.pathname)
    }

    const handleScroll = () => {
      setYPos(prevYPos => {
        const currentYPos = window.scrollY

        if (currentYPos > 0) setIsHide(prevYPos < currentYPos)

        return currentYPos
      })
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [path, setPath])

  return (
    <header id="Header" className={`${isHide ? 'hide' : 'show'} ${isMobile ? 'mobile' : ''}`}>
      <div className="header-title">
        <Link to="/">
          <div className="header-profile-image-wrap">
            <img
              src={
                config.profileImageFileName
                  ? require(`../../images/${config.profileImageFileName}`).default
                  : 'https://source.unsplash.com/random/25x25'
              }
              alt="title profile picture"
              width={imageSize}
              height={imageSize}
            />
          </div>
        </Link>

        <Link to="/">
          <h1 className="header-title-text">{siteTitle}</h1>
        </Link>
      </div>

      <nav id="nav">
        <div className="theme-toggle">
          <div className="theme-toggle-description" style={{ display: isMobile ? 'none' : 'flex' }}>
            <Fa
              icon={colorMode === 'dark' ? faMoon : faSun}
              style={{ fontSize: colorMode === 'dark' ? '1.1rem' : '1.2rem' }}
            />
            <Fa icon={faChevronRight} style={{ fontSize: '0.9rem' }} />
          </div>

          <Fa
            icon={colorMode === 'dark' ? faSun : faMoon}
            style={{ fontSize: colorMode === 'dark' ? '1.2rem' : '1.1rem' }}
            onMouseEnter={() => {
              const toggle = bioRef.current
              if (toggle) toggle.style.opacity = '0.5'
            }}
            onMouseLeave={() => {
              const toggle = bioRef.current
              if (toggle) toggle.style.opacity = '0'
            }}
            onClick={() => {
              toggleTheme()
            }}
          />
        </div>

        <ul>
          <li>
            <div className="tag-wrap">
              <Link to="/tags">
                <Fa icon={faTags} aria-label="tag icon" />
              </Link>
            </div>
          </li>

          <li>
            <div className="search-wrap">
              <Link to="/search" className="search">
                <Fa icon={faSearch} aria-label="search icon" />
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
