"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[691],{7549:function(e,t,a){var n=a(3493),l=a.n(n),r=a(5007),c=a(1597),m=(0,r.memo)((function(e){var t=e.posts,a=(0,r.useState)(10),n=a[0],m=a[1],s=(0,r.useCallback)(l()((function(){window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&m((function(e){return e>=t.length?e:e+10}))}),250),[]);(0,r.useEffect)((function(){return window.addEventListener("scroll",s),function(){window.removeEventListener("scroll",s)}}),[]),t.sort((function(e,t){var a,n,l=new Date(null!==(a=e.node.frontmatter.update)&&void 0!==a?a:e.node.frontmatter.date),r=new Date(null!==(n=t.node.frontmatter.update)&&void 0!==n?n:t.node.frontmatter.date);return l<r?1:l>r?-1:0}));var o=t.map((function(e,t){var a=e.node,l=a.excerpt,m=a.fields,s=a.frontmatter,o=a.timeToRead,i=m.slug,u=s.date,E=s.title,d=s.tags,f=s.update;1===Number(f.split(",")[1])&&(f=null);var p=d.map((function(e){if("undefined"!==e)return r.createElement("li",{key:i+"-"+e,className:"tag"},r.createElement("span",null,r.createElement(c.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return r.createElement("li",{key:i,className:"post "+(t<n?"show":"hide")},r.createElement("div",{className:"date"},r.createElement("small",null,u," • ",o," min read ☕")),r.createElement("article",null,r.createElement("h2",{className:"title"},r.createElement(c.Link,{to:i,className:"link"},E)),r.createElement("div",{className:"info"},r.createElement("ul",{className:"tag-list"},p)),r.createElement("span",{className:"excerpt"},r.createElement(c.Link,{to:i,className:"link"},l))))}));return r.createElement("div",{className:"post-list"},r.createElement("ul",null,o))}));t.Z=m},4066:function(e,t,a){a.r(t),a.d(t,{default:function(){return f}});var n=a(5007),l=a(1597),r=a(7606),c=a(8014),m=a(7897),s=a(4001),o=a(7190),i=a(1349),u=a.n(i),E=function(){var e=u().comment,t=u().name,a=u().company,l=u().location,m=u().email,s=u().website,i=u().linkedin,E=u().facebook,d=u().instagram,f=u().github,p=u().kaggle,N=u().medium,v=u().sildeshare;return n.createElement("div",{className:"bio"},e?n.createElement("span",{className:"comment"},e):null,t?n.createElement("div",{className:"bio-item name"},n.createElement("div",{className:"icon-wrap"},n.createElement(r.G,{icon:c.m08})),n.createElement("a",{href:"/about"},n.createElement("span",null,t))):null,a?n.createElement("div",{className:"bio-item company"},n.createElement("div",{className:"icon-wrap"},n.createElement(r.G,{icon:c.P88})),n.createElement("span",null,a)):null,l?n.createElement("div",{className:"bio-item location"},n.createElement("div",{className:"icon-wrap"},n.createElement(r.G,{icon:c.FGq})),n.createElement("span",null,l)):null,m?n.createElement("div",{className:"bio-item email"},n.createElement("div",{className:"icon-wrap"},n.createElement(r.G,{icon:c.IBq})),n.createElement("a",{href:"mailto:"+m},m)):null,s?n.createElement("div",{className:"bio-item website"},n.createElement("div",{className:"icon-wrap"},n.createElement(r.G,{icon:c.nNP})),n.createElement("a",{href:s,target:"_blank",rel:"noopener noreferrer"},s)):null,n.createElement("div",{className:"bio-item about"},n.createElement("div",{className:"icon-wrap"},n.createElement(r.G,{icon:c.dLO})),n.createElement("a",{href:"/about"},n.createElement("span",null,"About ME"))),n.createElement("div",{className:"social"},n.createElement("a",{href:u().siteUrl+"/rss",target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:c.Fwd,className:"rss"})),i?n.createElement("a",{href:i,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.D9H,className:"linkedin"})):null,E?n.createElement("a",{href:E,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.neY,className:"facebook"})):null,d?n.createElement("a",{href:d,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.Zzi,className:"instagram"})):null,f?n.createElement("a",{href:f,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.zhw,className:"github"})):null,p?n.createElement("a",{href:p,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.zR6,className:"kaggle"})):null,N?n.createElement("a",{href:N,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.$tD,className:"medium"})):null,v?n.createElement("a",{href:v,target:"_blank",rel:"noopener noreferrer"},n.createElement(r.G,{icon:o.YSg,className:"sildeshare"})):null))},d=a(7549),f=function(e){var t=e.data,a=t.allMarkdownRemark.edges,o=t.site.siteMetadata.title;return n.createElement(m.Z,null,n.createElement(s.Z,{title:o}),n.createElement("div",{className:"index-wrap"},n.createElement(E,null),n.createElement("div",{className:"index-post-list-wrap"},n.createElement(d.Z,{posts:a}),a.length<10?null:n.createElement("div",{className:"show-more-posts"},n.createElement("div",{className:"show-more-btn"},n.createElement(l.Link,{to:"/search"},n.createElement(r.G,{icon:c.wn1}),n.createElement("span",null,"SHOW MORE POSTS")))))))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx-d00045e999b340ebf4df.js.map