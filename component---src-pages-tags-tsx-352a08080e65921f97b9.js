(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{JYtQ:function(e,t,n){},"l/wD":function(e,t,n){},uP4m:function(e,t,n){"use strict";var a=n("DzJC"),r=n.n(a),l=(n("ToJy"),n("FdF9")),o=n("Wbzz"),i=(n("l/wD"),Object(l.memo)((function(e){var t=e.posts,n=Object(l.useState)(10),a=n[0],i=n[1],u=Object(l.useCallback)(r()((function(){window.outerHeight>document.querySelector(".post-list").getBoundingClientRect().bottom&&i((function(e){return e>=t.length?e:e+10}))}),250),[]);Object(l.useEffect)((function(){return window.addEventListener("scroll",u),function(){window.removeEventListener("scroll",u)}}),[]),t.sort((function(e,t){var n,a,r=new Date(null!==(n=e.node.frontmatter.update)&&void 0!==n?n:e.node.frontmatter.date),l=new Date(null!==(a=t.node.frontmatter.update)&&void 0!==a?a:t.node.frontmatter.date);return r<l?1:r>l?-1:0}));var c=t.map((function(e,t){var n=e.node,r=n.excerpt,i=n.fields,u=n.frontmatter,c=i.slug,s=u.date,f=u.title,d=u.tags,m=n.timeToRead,p=u.update;1===Number(p.split(",")[1])&&(p=null);var v=d.map((function(e){if("undefined"!==e)return l.createElement("li",{key:c+"-"+e,className:"tag"},l.createElement("span",null,l.createElement(o.Link,{to:"/tags#"+e,className:"link"},"#"+e)))}));return l.createElement("li",{key:c,className:"post "+(t<a?"show":"hide")},l.createElement("div",{className:"date"},l.createElement("small",null,s," • ",m," min read ☕")),l.createElement("article",null,l.createElement("h2",{className:"title"},l.createElement(o.Link,{to:c,className:"link"},f)),l.createElement("div",{className:"info"},l.createElement("ul",{className:"tag-list"},v)),l.createElement("span",{className:"excerpt"},l.createElement(o.Link,{to:c,className:"link"},r))))}));return l.createElement("div",{className:"post-list"},l.createElement("ul",null,c))})));t.a=i},xSjX:function(e,t,n){"use strict";n.r(t);n("ToJy");var a=n("FdF9"),r=n("VXBa"),l=n("H8eV"),o=(n("JYtQ"),n("uP4m"));function i(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var a=0;return function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}t.default=function(e){var t=e.data.allMarkdownRemark.group,n=Object(a.useState)(0),u=n[0],c=n[1],s=Object(a.useState)(),f=s[0],d=s[1],m=Object(a.useState)([]),p=m[0],v=m[1];t.sort((function(e,t){var n=e.fieldValue.toLocaleLowerCase(),a=t.fieldValue.toLocaleLowerCase();return n<a?-1:a<n?1:0}));var b=t.map((function(e){var t;return a.createElement("li",{key:e.fieldValue},a.createElement("span",{className:"tag-text",style:{fontSize:"undefined"!==e.fieldValue?(t=Math.round(50/(u/e.totalCount)).toString(),t.length<=1&&(t="0"+t),Number(t)/100+.9+"rem"):"0.9rem",opacity:e.fieldValue===f?"0.9":"0.5",fontWeight:e.fieldValue===f?"bold":"normal"},onClick:function(){d(e.fieldValue)}},a.createElement("a",{href:"#"+e.fieldValue},e.fieldValue)))})),E=Object(a.useCallback)((function(){return t.filter((function(e){return e.fieldValue===f})).length?t.filter((function(e){return e.fieldValue===f}))[0].edges:t.filter((function(e){return"undefined"===e.fieldValue})).length?t.filter((function(e){return"undefined"===e.fieldValue}))[0].edges:[]}),[f]);return Object(a.useEffect)((function(){var e;d(null!==(e=location)&&void 0!==e&&e.hash?location.hash.split("#")[1]:"undefined");for(var n,a=0,r=i(t);!(n=r()).done;){var l=n.value;"undefined"!==l.fieldValue&&l.totalCount>a&&(a=l.totalCount)}c(a)}),[]),Object(a.useEffect)((function(){f&&v(E())}),[f]),a.createElement(r.a,null,a.createElement(l.a,{title:"Tags"}),a.createElement("div",{id:"tags"},a.createElement("div",{className:"tag-list-wrap"},a.createElement("ul",null,b)),a.createElement(o.a,{posts:p.length?p:[]})))}}}]);
//# sourceMappingURL=component---src-pages-tags-tsx-352a08080e65921f97b9.js.map