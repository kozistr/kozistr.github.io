"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[691],{3472:function(e,t,a){var l=a(8209),n=a.n(l),s=a(518),r=a(5271);const c=(0,r.memo)((e=>{let{tag:t,slug:a}=e;return"undefined"===t?null:r.createElement("li",{key:`${a}-${t}`,className:"tag"},r.createElement("span",null,r.createElement(s.Link,{to:`/tags#${t}`,className:"link"},`#${t}`)))})),m=(0,r.memo)((e=>{let{posts:t}=e;const{0:a,1:l}=(0,r.useState)(10),m=(0,r.useMemo)((()=>t.sort(((e,t)=>{var a,l;const n=new Date(null!==(a=e.node.frontmatter.update)&&void 0!==a?a:e.node.frontmatter.date);return new Date(null!==(l=t.node.frontmatter.update)&&void 0!==l?l:t.node.frontmatter.date).getTime()-n.getTime()}))),[t]),i=(0,r.useCallback)(n()((()=>{window.outerHeight+window.scrollY>document.body.offsetHeight&&l((e=>e>=t.length?e:e+10))}),250),[t.length]);(0,r.useEffect)((()=>(window.addEventListener("scroll",i),()=>{window.removeEventListener("scroll",i)})),[i]);const o=m.map(((e,t)=>{var l;const{node:n}=e,{excerpt:m,fields:i,frontmatter:o,timeToRead:d}=n,{slug:u}=i,{date:E,title:k,tags:N}=o;let g=o.update;return 1===Number(null===(l=g)||void 0===l?void 0:l.split(",")[1])&&(g=null),r.createElement("li",{key:u,className:"post "+(t<a?"show":"hide")},r.createElement("div",{className:"date"},r.createElement("small",null,E," • ",d," min read ☕")),r.createElement("article",null,r.createElement("h2",{className:"title"},r.createElement(s.Link,{to:u,className:"link"},k)),r.createElement("div",{className:"info"},r.createElement("ul",{className:"tag-list"},N.map((e=>r.createElement(c,{key:e,tag:e,slug:u}))))),r.createElement("span",{className:"excerpt"},r.createElement(s.Link,{to:u,className:"link"},m))))}));return r.createElement("div",{className:"post-list"},r.createElement("ul",null,o))}));t.Z=m},1246:function(e,t,a){a.r(t),a.d(t,{default:function(){return g}});var l=a(5828),n=a(9991),s=a(518),r=a(5271),c=a(973),m=a(8490),i=a.n(m);const o=e=>{let{icon:t,link:a,text:l,className:s}=e;return r.createElement("div",{className:`bio-item ${s||""}`},r.createElement("div",{className:"icon-wrap"},r.createElement(n.G,{icon:t})),a?r.createElement("a",{href:a},l||a):l?r.createElement("span",null,l):null)},d=e=>{let{icon:t,link:a,className:l}=e;return r.createElement("a",{href:a,target:"_blank",rel:"noopener noreferrer"},r.createElement(n.G,{icon:t,className:l}))};var u=()=>{const{comment:e,name:t,company:a,location:n,email:s,website:m,linkedin:u,facebook:E,instagram:k,github:N,kaggle:g,medium:p,sildeshare:b}=i(),f={linkedin:u,facebook:E,instagram:k,github:N,kaggle:g,medium:p,sildeshare:b},v={linkedin:c.D9H,facebook:c.neY,instagram:c.Zzi,github:c.zhw,kaggle:c.zR6,medium:c.$tD,sildeshare:c.YSg};return r.createElement("div",{className:"bio"},e&&r.createElement("span",{className:"comment"},e),r.createElement(o,{icon:l.m08,link:"/about",text:t,className:"name"}),r.createElement(o,{icon:l.P88,text:a,className:"company"}),r.createElement(o,{icon:l.FGq,text:n,className:"location"}),r.createElement(o,{icon:l.IBq,link:`mailto:${s}`,text:s,className:"email"}),r.createElement(o,{icon:l.nNP,link:m,className:"website"}),r.createElement(o,{icon:l.dLO,link:"/about",text:"About ME",className:"about"}),r.createElement("div",{className:"social"},r.createElement(d,{icon:l.Fwd,link:`${i().siteUrl}/rss`,className:"rss"}),Object.entries(f).map((e=>{let[t,a]=e;return a?r.createElement(d,{key:t,icon:v[t],link:a,className:t}):null}))))},E=a(4348),k=a(3472),N=a(7751);var g=e=>{const{data:t}=e,a=t.allMarkdownRemark.edges,c=t.site.siteMetadata.title;return r.createElement(E.Z,null,r.createElement(N.Z,{title:c}),r.createElement("div",{className:"index-wrap"},r.createElement(u,null),r.createElement("div",{className:"index-post-list-wrap"},r.createElement(k.Z,{posts:a}),a.length<10?null:r.createElement("div",{className:"show-more-posts"},r.createElement("div",{className:"show-more-btn"},r.createElement(s.Link,{to:"/search"},r.createElement(n.G,{icon:l.wn1}),r.createElement("span",null,"SHOW MORE POSTS")))))))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx.js.map