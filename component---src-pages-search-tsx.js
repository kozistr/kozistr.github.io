"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[334],{8812:function(e,t,a){var n=a(8209),l=a.n(n),r=a(105),s=a(959);const c=(0,s.memo)((e=>{const{posts:t}=e,{0:a,1:n}=(0,s.useState)(10),c=(0,s.useCallback)(l()((()=>{window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&n((e=>e>=t.length?e:e+10))}),250),[]);(0,s.useEffect)((()=>(window.addEventListener("scroll",c),()=>{window.removeEventListener("scroll",c)})),[]),t.sort(((e,t)=>{var a,n;const l=new Date(null!==(a=e.node.frontmatter.update)&&void 0!==a?a:e.node.frontmatter.date),r=new Date(null!==(n=t.node.frontmatter.update)&&void 0!==n?n:t.node.frontmatter.date);return l<r?1:l>r?-1:0}));const o=t.map(((e,t)=>{const{node:n}=e,{excerpt:l,fields:c,frontmatter:o,timeToRead:m}=n,{slug:i}=c,{date:u,title:d,tags:p}=o;let E=o.update;1===Number(E.split(",")[1])&&(E=null);const f=p.map((e=>{if("undefined"!==e)return s.createElement("li",{key:i+"-"+e,className:"tag"},s.createElement("span",null,s.createElement(r.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return s.createElement("li",{key:i,className:"post "+(t<a?"show":"hide")},s.createElement("div",{className:"date"},s.createElement("small",null,u," • ",m," min read ☕")),s.createElement("article",null,s.createElement("h2",{className:"title"},s.createElement(r.Link,{to:i,className:"link"},d)),s.createElement("div",{className:"info"},s.createElement("ul",{className:"tag-list"},f)),s.createElement("span",{className:"excerpt"},s.createElement(r.Link,{to:i,className:"link"},l))))}));return s.createElement("div",{className:"post-list"},s.createElement("ul",null,o))}));t.Z=c},3957:function(e,t,a){a.r(t);var n=a(3155),l=a(1108),r=a(959),s=a(3165),c=a(8812),o=a(4510);t.default=e=>{const{data:t}=e,a=t.allMarkdownRemark.edges,{0:m,1:i}=(0,r.useState)(""),{0:u,1:d}=(0,r.useState)(!0),p=(0,r.useCallback)(a.filter((e=>{const{node:t}=e,{frontmatter:a,rawMarkdownBody:n}=t,{title:l}=a,r=m.toLocaleLowerCase();return!(u||!n.toLocaleLowerCase().includes(r))||l.toLocaleLowerCase().includes(r)})),[m,u]);return r.createElement(s.Z,null,r.createElement(o.Z,{title:"Search"}),r.createElement("div",{id:"Search"},r.createElement("div",{className:"search-inner-wrap"},r.createElement("div",{className:"input-wrap"},r.createElement(l.G,{icon:n.wn1}),r.createElement("input",{type:"text",name:"search",id:"searchInput",value:m,placeholder:"Search",autoComplete:"off",autoFocus:!0,onChange:e=>{i(e.currentTarget.value)}}),r.createElement("div",{className:"search-toggle"},r.createElement("span",{style:{opacity:u?.8:.15},onClick:()=>{d(!0)}},"in Title"),r.createElement("span",{style:{opacity:u?.15:.8},onClick:()=>{d(!1)}},"in Title+Content"))),""===m||p.length?null:r.createElement("span",{className:"no-result"},"No search results"),r.createElement(c.Z,{posts:""===m?a:p}))))}}}]);
//# sourceMappingURL=component---src-pages-search-tsx.js.map