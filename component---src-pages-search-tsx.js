"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[334],{9650:function(e,t,a){var n=a(8209),l=a.n(n),r=a(9496),s=a(1872);const c=(0,r.memo)((e=>{const{posts:t}=e,{0:a,1:n}=(0,r.useState)(10),c=(0,r.useCallback)(l()((()=>{window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&n((e=>e>=t.length?e:e+10))}),250),[]);(0,r.useEffect)((()=>(window.addEventListener("scroll",c),()=>{window.removeEventListener("scroll",c)})),[]),t.sort(((e,t)=>{var a,n;const l=new Date(null!==(a=e.node.frontmatter.update)&&void 0!==a?a:e.node.frontmatter.date),r=new Date(null!==(n=t.node.frontmatter.update)&&void 0!==n?n:t.node.frontmatter.date);return l<r?1:l>r?-1:0}));const o=t.map(((e,t)=>{const{node:n}=e,{excerpt:l,fields:c,frontmatter:o,timeToRead:m}=n,{slug:i}=c,{date:u,title:d,tags:p}=o;let E=o.update;1===Number(E.split(",")[1])&&(E=null);const f=p.map((e=>{if("undefined"!==e)return r.createElement("li",{key:i+"-"+e,className:"tag"},r.createElement("span",null,r.createElement(s.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return r.createElement("li",{key:i,className:"post "+(t<a?"show":"hide")},r.createElement("div",{className:"date"},r.createElement("small",null,u," • ",m," min read ☕")),r.createElement("article",null,r.createElement("h2",{className:"title"},r.createElement(s.Link,{to:i,className:"link"},d)),r.createElement("div",{className:"info"},r.createElement("ul",{className:"tag-list"},f)),r.createElement("span",{className:"excerpt"},r.createElement(s.Link,{to:i,className:"link"},l))))}));return r.createElement("div",{className:"post-list"},r.createElement("ul",null,o))}));t.Z=c},1973:function(e,t,a){a.r(t);var n=a(9496),l=a(125),r=a(6678),s=a(9275),c=a(5264),o=a(9650);t.default=e=>{const{data:t}=e,a=t.allMarkdownRemark.edges,{0:m,1:i}=(0,n.useState)(""),{0:u,1:d}=(0,n.useState)(!0),p=(0,n.useCallback)(a.filter((e=>{const{node:t}=e,{frontmatter:a,rawMarkdownBody:n}=t,{title:l}=a,r=m.toLocaleLowerCase();return!(u||!n.toLocaleLowerCase().includes(r))||l.toLocaleLowerCase().includes(r)})),[m,u]);return n.createElement(s.Z,null,n.createElement(c.Z,{title:"Search"}),n.createElement("div",{id:"Search"},n.createElement("div",{className:"search-inner-wrap"},n.createElement("div",{className:"input-wrap"},n.createElement(l.G,{icon:r.wn1}),n.createElement("input",{type:"text",name:"search",id:"searchInput",value:m,placeholder:"Search",autoComplete:"off",autoFocus:!0,onChange:e=>{i(e.currentTarget.value)}}),n.createElement("div",{className:"search-toggle"},n.createElement("span",{style:{opacity:u?.8:.15},onClick:()=>{d(!0)}},"in Title"),n.createElement("span",{style:{opacity:u?.15:.8},onClick:()=>{d(!1)}},"in Title+Content"))),""===m||p.length?null:n.createElement("span",{className:"no-result"},"No search results"),n.createElement(o.Z,{posts:""===m?a:p}))))}}}]);
//# sourceMappingURL=component---src-pages-search-tsx.js.map