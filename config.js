module.exports = {
  /** Site MetaData (Required all)*/
  title: `kozistr`,                             // (* Required)
  description: `Building awesome products & technologies to change the world!`, // (* Required)
  author: `Hyeongchan Kim`,                     // (* Required)
  language: 'ko-KR',                            // (* Required) html lang, ex. 'en' | 'en-US' | 'ko' | 'ko-KR' | ...
  siteUrl: 'http://kozistr.tech',               // (* Required)
    // ex.'https://junhobaik.github.io'
    // ex.'https://junhobaik.github.io/' << X, Do not enter "/" at the end.

  /** Header */
  profileImageFileName: 'profile.png', // include filename extension ex.'profile.jpg'
    // The Profile image file is located at path "./images/"
    // If the file does not exist, it is replaced by a random image.

  /** Home > Bio information*/
  comment: 'Machine Learning Researcher at Watcha',
  name: 'Hyeongchan Kim',
  company: 'Watcha',
  location: 'Korea',
  email: 'kozistr@gmail.com',
  website: 'http://kozistr.tech',
  linkedin: 'https://www.linkedin.com/in/kozistr',
  facebook: '',
  instagram: '',
  github: 'https://github.com/kozistr',

  /** Post */
  enablePostOfContents: true,           // TableOfContents activation (Type of Value: Boolean. Not String)
  disqusShortname: 'zer0days-blog',     // comments (Disqus sort-name)
  enableSocialShare: true,              // Social share icon activation (Type of Value: Boolean. Not String)

  /** Optional */
  googleAnalytics: 'UA-116366668-1',                                  // Google Analytics TrackingID. ex.'UA-123456789-0'
  googleSearchConsole: 'yVb-5RupSxz0n597I3F2TyflhbyZqUs8rHyLmrzqJB4', // content value in HTML tag of google search console ownership verification
  googleAdsenseSlot: 'ca-pub-7954241517411559',                       // Google Adsense Slot. ex.'5214956675'
  googleAdsenseClient: '',                     // Google Adsense Client. ex.'ca-pub-5001380215831339'
    // Please correct the adsense client number(ex.5001380215831339) in the './static/ads.txt' file.
};
