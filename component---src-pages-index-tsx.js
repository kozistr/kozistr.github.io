"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[691],{2803:function(e,t,a){var n=a(8209),l=a.n(n),r=a(6594),c=a(959);const m=(0,c.memo)((e=>{const{posts:t}=e,{0:a,1:n}=(0,c.useState)(10),m=(0,c.useCallback)(l()((()=>{window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&n((e=>e>=t.length?e:e+10))}),250),[]);(0,c.useEffect)((()=>(window.addEventListener("scroll",m),()=>{window.removeEventListener("scroll",m)})),[]),t.sort(((e,t)=>{var a,n;const l=new Date(null!==(a=e.node.frontmatter.update)&&void 0!==a?a:e.node.frontmatter.date),r=new Date(null!==(n=t.node.frontmatter.update)&&void 0!==n?n:t.node.frontmatter.date);return l<r?1:l>r?-1:0}));const s=t.map(((e,t)=>{const{node:n}=e,{excerpt:l,fields:m,frontmatter:s,timeToRead:o}=n,{slug:i}=m,{date:E,title:d,tags:u}=s;let p=s.update;1===Number(p.split(",")[1])&&(p=null);const f=u.map((e=>{if("undefined"!==e)return c.createElement("li",{key:i+"-"+e,className:"tag"},c.createElement("span",null,c.createElement(r.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return c.createElement("li",{key:i,className:"post "+(t<a?"show":"hide")},c.createElement("div",{className:"date"},c.createElement("small",null,E," • ",o," min read ☕")),c.createElement("article",null,c.createElement("h2",{className:"title"},c.createElement(r.Link,{to:i,className:"link"},d)),c.createElement("div",{className:"info"},c.createElement("ul",{className:"tag-list"},f)),c.createElement("span",{className:"excerpt"},c.createElement(r.Link,{to:i,className:"link"},l))))}));return c.createElement("div",{className:"post-list"},c.createElement("ul",null,s))}));t.Z=m},7839:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var n=a(3155),l=a(1108),r=a(6594),c=a(959),m=a(5288),s=a(8266),o=a.n(s);var i=()=>{const{comment:e,name:t,company:a,location:r,email:s,website:i,linkedin:E,facebook:d,instagram:u,github:p,kaggle:f,medium:N,sildeshare:b}=o();return c.createElement("div",{className:"bio"},e?c.createElement("span",{className:"comment"},e):null,t?c.createElement("div",{className:"bio-item name"},c.createElement("div",{className:"icon-wrap"},c.createElement(l.G,{icon:n.m08})),c.createElement("a",{href:"/about"},c.createElement("span",null,t))):null,a?c.createElement("div",{className:"bio-item company"},c.createElement("div",{className:"icon-wrap"},c.createElement(l.G,{icon:n.P88})),c.createElement("span",null,a)):null,r?c.createElement("div",{className:"bio-item location"},c.createElement("div",{className:"icon-wrap"},c.createElement(l.G,{icon:n.FGq})),c.createElement("span",null,r)):null,s?c.createElement("div",{className:"bio-item email"},c.createElement("div",{className:"icon-wrap"},c.createElement(l.G,{icon:n.IBq})),c.createElement("a",{href:"mailto:"+s},s)):null,i?c.createElement("div",{className:"bio-item website"},c.createElement("div",{className:"icon-wrap"},c.createElement(l.G,{icon:n.nNP})),c.createElement("a",{href:i,target:"_blank",rel:"noopener noreferrer"},i)):null,c.createElement("div",{className:"bio-item about"},c.createElement("div",{className:"icon-wrap"},c.createElement(l.G,{icon:n.dLO})),c.createElement("a",{href:"/about"},c.createElement("span",null,"About ME"))),c.createElement("div",{className:"social"},c.createElement("a",{href:o().siteUrl+"/rss",target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:n.Fwd,className:"rss"})),E?c.createElement("a",{href:E,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.D9H,className:"linkedin"})):null,d?c.createElement("a",{href:d,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.neY,className:"facebook"})):null,u?c.createElement("a",{href:u,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.Zzi,className:"instagram"})):null,p?c.createElement("a",{href:p,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.zhw,className:"github"})):null,f?c.createElement("a",{href:f,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.zR6,className:"kaggle"})):null,N?c.createElement("a",{href:N,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.$tD,className:"medium"})):null,b?c.createElement("a",{href:b,target:"_blank",rel:"noopener noreferrer"},c.createElement(l.G,{icon:m.YSg,className:"sildeshare"})):null))},E=a(8780),d=a(2803),u=a(9335);var p=e=>{const{data:t}=e,a=t.allMarkdownRemark.edges,m=t.site.siteMetadata.title;return c.createElement(E.Z,null,c.createElement(u.Z,{title:m}),c.createElement("div",{className:"index-wrap"},c.createElement(i,null),c.createElement("div",{className:"index-post-list-wrap"},c.createElement(d.Z,{posts:a}),a.length<10?null:c.createElement("div",{className:"show-more-posts"},c.createElement("div",{className:"show-more-btn"},c.createElement(r.Link,{to:"/search"},c.createElement(l.G,{icon:n.wn1}),c.createElement("span",null,"SHOW MORE POSTS")))))))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx.js.map