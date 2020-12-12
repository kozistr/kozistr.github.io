import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faTags, faSearch, faMoon, faSun, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { useColorMode } from 'theme-ui';

import './header.scss';
const config = require('../../../config');

export interface headerPropsType {
  siteTitle: string;
  path: string;
  size: string;
  isMobile: boolean;
  setPath: Function;
}

const Header = (props: headerPropsType) => {
  const { siteTitle, path, setPath, size, isMobile } = props;
  const [, setYPos] = useState(0);
  const [isHide, setIsHide] = useState(false);
  const [colorMode, setColorMode] = useColorMode();

  const toggleTheme = useCallback(() => {
    const ms: number = 300;
    const header: HTMLElement | null = document.getElementById('Header');

    document.body.style.transition = `background-color ${ms}ms`;
    if (header) header.style.transition = `background-color ${ms}ms`;

    if (colorMode === 'dark') {
      setColorMode('default');
    } else {
      setColorMode('dark');
    }

    setTimeout(() => {
      document.body.style.transition = 'none';
      if (header) header.style.transition = `background-color ${ms}ms`;
    }, ms + 100);
  }, [colorMode]);

  useEffect(() => {
    const bio: HTMLDivElement | null = document.querySelector('.bio');
    if (bio) {
      if (isHide === true) {
        bio.style.opacity = '0';
        bio.style.pointerEvents = 'none';
      } else {
        bio.style.opacity = '1';
        bio.style.pointerEvents = 'all';
      }
    }
  }, [isHide]);

  useEffect(() => {
    const profile: HTMLImageElement | null = document.querySelector('.header-profile-image-wrap>img');

    const prevPath: string = path;
    const currPath: string = location.pathname;

    if (profile) {
      if (currPath === prevPath) {
        setPath(location.pathname, currPath !== '/' ? '25px' : '50px');
      }

      if (prevPath !== '/' && currPath === '/') {
        setPath(location.pathname, '50px');
      }

      if (prevPath === '/' && currPath !== '/') {
        setPath(location.pathname, '25px');
      }

      if (prevPath !== '/' && currPath !== '/') {
        setPath(location.pathname);
      }
    } else {
      setPath(location.pathname);
    }

    const setVisible: () => void = () => {
      setYPos(prevYPos => {
        const currentYPos = window.pageYOffset;

        if (currentYPos > 0) setIsHide(prevYPos < currentYPos);

        return currentYPos;
      });
    };
    document.addEventListener('scroll', setVisible);
    return () => document.removeEventListener('scroll', setVisible);
  }, []);

  return (
    <header id="Header" className={`${isHide ? 'hide' : 'show'} ${isMobile ? 'mobile' : ''}`}>
      <div className="header-title">
        <Link to="/">
          <div className="header-profile-image-wrap">
            <img
              src={
                config.profileImageFileName
                  ? require(`../../images/${config.profileImageFileName}`)
                  : 'https://source.unsplash.com/random/100x100'
              }
              alt="title profile picture"
              width={size || '25px'}
              height={size || '25px'}
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
              const toggle: HTMLDivElement | null = document.querySelector('.theme-toggle-description');
              if (toggle) toggle.style.opacity = '0.5';
            }}
            onMouseLeave={() => {
              const toggle: HTMLDivElement | null = document.querySelector('.theme-toggle-description');
              if (toggle) toggle.style.opacity = '0';
            }}
            onClick={() => {
              toggleTheme();
            }}
          />
        </div>

        <ul>
          <li>
            <div className="tag-wrap">
              <Link to="/tags">
                <Fa icon={faTags} />
              </Link>
            </div>
          </li>

          <li>
            <div className="search-wrap">
              <Link to="/search" className="search">
                <Fa icon={faSearch} />
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const mapStateToProps = ({ path, size, isMobile }: { path: string; size: string; isMobile: boolean }) => {
  return { path, size, isMobile };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    setPath: (path: string, size: string) => dispatch({ type: `SET_PATH`, path, size }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
