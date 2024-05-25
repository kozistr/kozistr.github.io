import {
  IconDefinition,
  faFacebook,
  faGithub,
  faInstagram,
  faKaggle,
  faLinkedin,
  faMedium,
  faSlideshare,
} from '@fortawesome/free-brands-svg-icons'
import {
  faAddressCard,
  faAt,
  faBuilding,
  faLink,
  faMapMarkerAlt,
  faRss,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import React from 'react'

import './bio.scss'
import config from '../../../config'

type SocialIconKey = 'linkedin' | 'facebook' | 'instagram' | 'github' | 'kaggle' | 'medium' | 'sildeshare'

const BioItem: React.FC<{ icon: IconDefinition; link?: string; text?: string; className?: string }> = ({
  icon,
  link,
  text,
  className,
}) => (
  <div className={`bio-item ${className || ''}`}>
    <div className="icon-wrap">
      <Fa icon={icon} />
    </div>
    {link ? (
      <a href={link} aria-label={text}>
        {text || link}
      </a>
    ) : text ? (
      <span>{text}</span>
    ) : null}
  </div>
)

const SocialItem: React.FC<{ icon: IconDefinition; link?: string; className?: string }> = ({
  icon,
  link,
  className,
}) => (
  <a href={link} className={className} target="_blank" rel="noopener noreferrer">
    <Fa icon={icon} className={className} />
  </a>
)

const Bio = () => {
  const {
    comment,
    name,
    company,
    location,
    email,
    website,
    linkedin,
    facebook,
    instagram,
    github,
    kaggle,
    medium,
    sildeshare,
  } = config

  const socialLinks = {
    linkedin,
    facebook,
    instagram,
    github,
    kaggle,
    medium,
    sildeshare,
  }

  const socialIcons: { [key in SocialIconKey]: IconDefinition } = {
    linkedin: faLinkedin,
    facebook: faFacebook,
    instagram: faInstagram,
    github: faGithub,
    kaggle: faKaggle,
    medium: faMedium,
    sildeshare: faSlideshare,
  }

  return (
    <div className="bio">
      {comment && <span className="comment">{comment}</span>}

      <BioItem icon={faUserCircle} link="/about" text={name} className="name" />
      <BioItem icon={faBuilding} text={company} className="company" />
      <BioItem icon={faMapMarkerAlt} text={location} className="location" />
      <BioItem icon={faAt} link={`mailto:${email}`} text={email} className="email" />
      <BioItem icon={faLink} link={website} className="website" />
      <BioItem icon={faAddressCard} link="/about" text="About ME" className="about" />

      <div className="social">
        <SocialItem icon={faRss} link={`${config.siteUrl}/rss`} className="rss" />

        {Object.entries(socialLinks).map(([key, value]) =>
          value ? <SocialItem key={key} icon={socialIcons[key as SocialIconKey]} link={value} className={key} /> : null
        )}
      </div>
    </div>
  )
}

export default Bio
