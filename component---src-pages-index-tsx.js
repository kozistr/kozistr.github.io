"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[245],{6894:function(e,t,a){var l=a(462),n=a.n(l),s=a(4357),r=a(758);const m=(0,r.memo)((e=>{let{tag:t,slug:a}=e;return"undefined"===t?null:r.createElement("li",{key:`${a}-${t}`,className:"tag"},r.createElement("span",null,r.createElement(s.Link,{to:`/tags#${t}`,className:"link"},`#${t}`)))})),c=(0,r.memo)((e=>{let{posts:t}=e;const{0:a,1:l}=(0,r.useState)(10),c=(0,r.useMemo)((()=>t.sort(((e,t)=>{var a,l;const n=new Date(null!==(a=e.node.frontmatter.update)&&void 0!==a?a:e.node.frontmatter.date);return new Date(null!==(l=t.node.frontmatter.update)&&void 0!==l?l:t.node.frontmatter.date).getTime()-n.getTime()}))),[t]),i=(0,r.useCallback)(n()((()=>{window.outerHeight+window.scrollY>document.body.offsetHeight&&l((e=>e>=t.length?e:e+10))}),250),[t.length]);(0,r.useEffect)((()=>(window.addEventListener("scroll",i),()=>{window.removeEventListener("scroll",i)})),[i]);const o=c.map(((e,t)=>{var l;const{node:n}=e,{excerpt:c,fields:i,frontmatter:o,timeToRead:u}=n,{slug:d}=i,{date:E,title:k,tags:g}=o;let N=o.update;return 1===Number(null===(l=N)||void 0===l?void 0:l.split(",")[1])&&(N=null),r.createElement("li",{key:d,className:"post "+(t<a?"show":"hide")},r.createElement("div",{className:"date"},r.createElement("small",null,E," • ",u," min read ☕")),r.createElement("article",null,r.createElement("h2",{className:"title"},r.createElement(s.Link,{to:d,className:"link"},k)),r.createElement("div",{className:"info"},r.createElement("ul",{className:"tag-list"},g.map((e=>r.createElement(m,{key:e,tag:e,slug:d}))))),r.createElement("span",{className:"excerpt"},r.createElement(s.Link,{to:d,className:"link"},c))))}));return r.createElement("div",{className:"post-list"},r.createElement("ul",null,o))}));t.A=c},6678:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var l=a(5017),n=a(5997),s=a(4357),r=a(758),m=a(2883),c=a(657),i=a.n(c);const o=(0,r.memo)((e=>{let{icon:t,link:a,text:l,className:s}=e;return r.createElement("div",{className:`bio-item ${s||""}`},r.createElement("div",{className:"icon-wrap"},r.createElement(n.g,{icon:t})),a?r.createElement("a",{href:a,"aria-label":l},l||a):l?r.createElement("span",null,l):null)})),u=(0,r.memo)((e=>{let{icon:t,link:a,className:l}=e;return r.createElement("a",{href:a,className:l,target:"_blank",rel:"noopener noreferrer"},r.createElement(n.g,{icon:t,className:l}))})),d=()=>{const{comment:e,name:t,company:a,location:n,email:s,website:c,linkedin:d,facebook:E,instagram:k,github:g,kaggle:N,medium:p,sildeshare:b}=i(),f={linkedin:d,facebook:E,instagram:k,github:g,kaggle:N,medium:p,sildeshare:b},v={linkedin:m.IAJ,facebook:m.aUl,instagram:m.QV6,github:m.Vz1,kaggle:m.rhI,medium:m.T03,sildeshare:m.wxb};return r.createElement("div",{className:"bio"},e&&r.createElement("span",{className:"comment"},e),r.createElement(o,{icon:l.VFr,link:"/about",text:t,className:"name"}),r.createElement(o,{icon:l.URI,text:a,className:"company"}),r.createElement(o,{icon:l.Pcr,text:n,className:"location"}),r.createElement(o,{icon:l.Hzw,link:`mailto:${s}`,text:s,className:"email"}),r.createElement(o,{icon:l.CQO,link:c,className:"website"}),r.createElement(o,{icon:l.oMV,link:"/about",text:"About ME",className:"about"}),r.createElement("div",{className:"social"},r.createElement(u,{icon:l.eGu,link:`${i().siteUrl}/rss`,className:"rss"}),Object.entries(f).map((e=>{let[t,a]=e;return a?r.createElement(u,{key:t,icon:v[t],link:a,className:t}):null}))))};var E=(0,r.memo)(d),k=a(7880),g=a(6894),N=a(4814);var p=e=>{let{data:t}=e;const{allMarkdownRemark:{edges:a},site:{siteMetadata:{title:m}}}=t;return r.createElement(k.A,null,r.createElement(N.A,{title:m}),r.createElement("div",{className:"index-wrap"},r.createElement(E,null),r.createElement("div",{className:"index-post-list-wrap"},r.createElement(g.A,{posts:a}),a.length<10?null:r.createElement("div",{className:"show-more-posts"},r.createElement("div",{className:"show-more-btn"},r.createElement(s.Link,{to:"/search"},r.createElement(n.g,{icon:l.MjD}),r.createElement("span",null,"SHOW MORE POSTS")))))))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx.js.map