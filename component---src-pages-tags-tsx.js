"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[190],{3784:function(e,t,l){var a=l(8209),n=l.n(a),r=l(2417),s=l(959);const o=(0,s.memo)((e=>{const{posts:t}=e,{0:l,1:a}=(0,s.useState)(10),o=(0,s.useCallback)(n()((()=>{window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&a((e=>e>=t.length?e:e+10))}),250),[]);(0,s.useEffect)((()=>(window.addEventListener("scroll",o),()=>{window.removeEventListener("scroll",o)})),[]),t.sort(((e,t)=>{var l,a;const n=new Date(null!==(l=e.node.frontmatter.update)&&void 0!==l?l:e.node.frontmatter.date),r=new Date(null!==(a=t.node.frontmatter.update)&&void 0!==a?a:t.node.frontmatter.date);return n<r?1:n>r?-1:0}));const i=t.map(((e,t)=>{const{node:a}=e,{excerpt:n,fields:o,frontmatter:i,timeToRead:c}=a,{slug:u}=o,{date:d,title:m,tags:f}=i;let E=i.update;1===Number(E.split(",")[1])&&(E=null);const p=f.map((e=>{if("undefined"!==e)return s.createElement("li",{key:u+"-"+e,className:"tag"},s.createElement("span",null,s.createElement(r.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return s.createElement("li",{key:u,className:"post "+(t<l?"show":"hide")},s.createElement("div",{className:"date"},s.createElement("small",null,d," • ",c," min read ☕")),s.createElement("article",null,s.createElement("h2",{className:"title"},s.createElement(r.Link,{to:u,className:"link"},m)),s.createElement("div",{className:"info"},s.createElement("ul",{className:"tag-list"},p)),s.createElement("span",{className:"excerpt"},s.createElement(r.Link,{to:u,className:"link"},n))))}));return s.createElement("div",{className:"post-list"},s.createElement("ul",null,i))}));t.Z=o},9246:function(e,t,l){l.r(t);var a=l(959),n=l(2994),r=l(3784),s=l(4569);t.default=e=>{const{data:t}=e,{group:l}=t.allMarkdownRemark,{0:o,1:i}=(0,a.useState)(0),{0:c,1:u}=(0,a.useState)(),{0:d,1:m}=(0,a.useState)([]);l.sort(((e,t)=>{const l=e.fieldValue.toLocaleLowerCase(),a=t.fieldValue.toLocaleLowerCase();return l<a?-1:a<l?1:0}));const f=l.map((e=>a.createElement("li",{key:e.fieldValue},a.createElement("span",{className:"tag-text",style:{fontSize:"undefined"!==e.fieldValue?(()=>{let t=Math.round(50/(o/e.totalCount)).toString();return t.length<=1&&(t="0"+t),Number(t)/100+.9+"rem"})():"0.9rem",opacity:e.fieldValue===c?"0.9":"0.5",fontWeight:e.fieldValue===c?"bold":"normal"},onClick:()=>{u(e.fieldValue)}},a.createElement("a",{href:"#"+e.fieldValue},e.fieldValue))))),E=(0,a.useCallback)((()=>l.filter((e=>e.fieldValue===c)).length?l.filter((e=>e.fieldValue===c))[0].edges:l.filter((e=>"undefined"===e.fieldValue)).length?l.filter((e=>"undefined"===e.fieldValue))[0].edges:[]),[c]);return(0,a.useEffect)((()=>{var e;u(null!==(e=location)&&void 0!==e&&e.hash?location.hash.split("#")[1]:"undefined");let t=0;for(const a of l)"undefined"!==a.fieldValue&&a.totalCount>t&&(t=a.totalCount);i(t)}),[]),(0,a.useEffect)((()=>{c&&m(E())}),[c]),a.createElement(n.Z,null,a.createElement(s.Z,{title:"Tags"}),a.createElement("div",{id:"tags"},a.createElement("div",{className:"tag-list-wrap"},a.createElement("ul",null,f)),a.createElement(r.Z,{posts:d.length?d:[]})))}}}]);
//# sourceMappingURL=component---src-pages-tags-tsx.js.map