"use strict";(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[190],{5194:function(e,t,n){var r=n(3493),a=n.n(r),l=n(5007),o=n(1597),i=(0,l.memo)((function(e){var t=e.posts,n=(0,l.useState)(10),r=n[0],i=n[1],u=(0,l.useCallback)(a()((function(){window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&i((function(e){return e>=t.length?e:e+10}))}),250),[]);(0,l.useEffect)((function(){return window.addEventListener("scroll",u),function(){window.removeEventListener("scroll",u)}}),[]),t.sort((function(e,t){var n,r,a=new Date(null!==(n=e.node.frontmatter.update)&&void 0!==n?n:e.node.frontmatter.date),l=new Date(null!==(r=t.node.frontmatter.update)&&void 0!==r?r:t.node.frontmatter.date);return a<l?1:a>l?-1:0}));var c=t.map((function(e,t){var n=e.node,a=n.excerpt,i=n.fields,u=n.frontmatter,c=n.timeToRead,s=i.slug,f=u.date,d=u.title,m=u.tags,p=u.update;1===Number(p.split(",")[1])&&(p=null);var v=m.map((function(e){if("undefined"!==e)return l.createElement("li",{key:s+"-"+e,className:"tag"},l.createElement("span",null,l.createElement(o.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return l.createElement("li",{key:s,className:"post "+(t<r?"show":"hide")},l.createElement("div",{className:"date"},l.createElement("small",null,f," • ",c," min read ☕")),l.createElement("article",null,l.createElement("h2",{className:"title"},l.createElement(o.Link,{to:s,className:"link"},d)),l.createElement("div",{className:"info"},l.createElement("ul",{className:"tag-list"},v)),l.createElement("span",{className:"excerpt"},l.createElement(o.Link,{to:s,className:"link"},a))))}));return l.createElement("div",{className:"post-list"},l.createElement("ul",null,c))}));t.Z=i},249:function(e,t,n){n.r(t);var r=n(5007),a=n(6098),l=n(7431),o=n(5194);function i(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}t.default=function(e){var t=e.data.allMarkdownRemark.group,n=(0,r.useState)(0),u=n[0],c=n[1],s=(0,r.useState)(),f=s[0],d=s[1],m=(0,r.useState)([]),p=m[0],v=m[1];t.sort((function(e,t){var n=e.fieldValue.toLocaleLowerCase(),r=t.fieldValue.toLocaleLowerCase();return n<r?-1:r<n?1:0}));var E=t.map((function(e){var t;return r.createElement("li",{key:e.fieldValue},r.createElement("span",{className:"tag-text",style:{fontSize:"undefined"!==e.fieldValue?(t=Math.round(50/(u/e.totalCount)).toString(),t.length<=1&&(t="0"+t),Number(t)/100+.9+"rem"):"0.9rem",opacity:e.fieldValue===f?"0.9":"0.5",fontWeight:e.fieldValue===f?"bold":"normal"},onClick:function(){d(e.fieldValue)}},r.createElement("a",{href:"#"+e.fieldValue},e.fieldValue)))})),g=(0,r.useCallback)((function(){return t.filter((function(e){return e.fieldValue===f})).length?t.filter((function(e){return e.fieldValue===f}))[0].edges:t.filter((function(e){return"undefined"===e.fieldValue})).length?t.filter((function(e){return"undefined"===e.fieldValue}))[0].edges:[]}),[f]);return(0,r.useEffect)((function(){var e;d(null!==(e=location)&&void 0!==e&&e.hash?location.hash.split("#")[1]:"undefined");for(var n,r=0,a=i(t);!(n=a()).done;){var l=n.value;"undefined"!==l.fieldValue&&l.totalCount>r&&(r=l.totalCount)}c(r)}),[]),(0,r.useEffect)((function(){f&&v(g())}),[f]),r.createElement(a.Z,null,r.createElement(l.Z,{title:"Tags"}),r.createElement("div",{id:"tags"},r.createElement("div",{className:"tag-list-wrap"},r.createElement("ul",null,E)),r.createElement(o.Z,{posts:p.length?p:[]})))}}}]);
//# sourceMappingURL=component---src-pages-tags-tsx-05ecda809c8a1fb1cfa7.js.map