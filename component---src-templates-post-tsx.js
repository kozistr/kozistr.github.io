/*! For license information please see component---src-templates-post-tsx.js.LICENSE.txt */
(self.webpackChunkborderless=self.webpackChunkborderless||[]).push([[186],{9803:function(e,t){var n;!function(){"use strict";var r={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var a=typeof n;if("string"===a||"number"===a)e.push(n);else if(Array.isArray(n)){if(n.length){var l=o.apply(null,n);l&&e.push(l)}}else if("object"===a)if(n.toString===Object.prototype.toString)for(var i in n)r.call(n,i)&&n[i]&&e.push(i);else e.push(n.toString())}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0===(n=function(){return o}.apply(t,[]))||(e.exports=n)}()},9940:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return ne}});var r=n(2297),o=n(8209),a=n.n(o),l=n(9496),i=n(7903),c=n(1585),s=n(7347),u=n(8777),d=n.n(u),f=n(125),p=n(6678),m=n(5259);function h(e){var t=Object.entries(e).filter((function(e){var t=e[1];return null!=t})).map((function(e){var t=e[0],n=e[1];return encodeURIComponent(t)+"="+encodeURIComponent(String(n))}));return t.length>0?"?"+t.join("&"):""}var y,w=n(9803),b=n.n(w),g=(y=function(e,t){return y=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},y(e,t)},function(e,t){function n(){this.constructor=e}y(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),v=function(){return v=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},v.apply(this,arguments)},E=function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function l(e){try{c(r.next(e))}catch(t){a(t)}}function i(e){try{c(r.throw(e))}catch(t){a(t)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(l,i)}c((r=r.apply(e,t||[])).next())}))},O=function(e,t){var n,r,o,a,l={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;l;)try{if(n=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return l.label++,{value:a[1],done:!1};case 5:l.label++,r=a[1],a=[0];continue;case 7:a=l.ops.pop(),l.trys.pop();continue;default:if(!(o=l.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){l=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){l.label=a[1];break}if(6===a[0]&&l.label<o[1]){l.label=o[1],o=a;break}if(o&&l.label<o[2]){l.label=o[2],l.ops.push(a);break}o[2]&&l.ops.pop(),l.trys.pop();continue}a=t.call(e,l)}catch(i){a=[6,i],r=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}},k=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n},j=function(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then},S=function(e,t){return{left:window.outerWidth/2+(window.screenX||window.screenLeft||0)-e/2,top:window.outerHeight/2+(window.screenY||window.screenTop||0)-t/2}},N=function(e,t){return{top:(window.screen.height-t)/2,left:(window.screen.width-e)/2}};function _(e,t,n){var r=t.height,o=t.width,a=k(t,["height","width"]),l=v({height:r,width:o,location:"no",toolbar:"no",status:"no",directories:"no",menubar:"no",scrollbars:"yes",resizable:"no",centerscreen:"yes",chrome:"yes"},a),i=window.open(e,"",Object.keys(l).map((function(e){return e+"="+l[e]})).join(", "));if(n)var c=window.setInterval((function(){try{(null===i||i.closed)&&(window.clearInterval(c),n(i))}catch(e){console.error(e)}}),1e3);return i}var C=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.openShareDialog=function(e){var n=t.props,r=n.onShareWindowClose,o=n.windowHeight,a=void 0===o?400:o,l=n.windowPosition,i=void 0===l?"windowCenter":l,c=n.windowWidth,s=void 0===c?550:c;_(e,v({height:a,width:s},"windowCenter"===i?S(s,a):N(s,a)),r)},t.handleClick=function(e){return E(t,void 0,void 0,(function(){var t,n,r,o,a,l,i,c,s,u;return O(this,(function(d){switch(d.label){case 0:return t=this.props,n=t.beforeOnClick,r=t.disabled,o=t.networkLink,a=t.onClick,l=t.url,i=t.openShareDialogOnClick,c=t.opts,s=o(l,c),r?[2]:(e.preventDefault(),n?(u=n(),j(u)?[4,u]:[3,2]):[3,2]);case 1:d.sent(),d.label=2;case 2:return i&&this.openShareDialog(s),a&&a(e,s),[2]}}))}))},t}return g(t,e),t.prototype.render=function(){var e=this.props,t=(e.beforeOnClick,e.children),n=e.className,r=e.disabled,o=e.disabledStyle,a=e.forwardedRef,i=(e.networkLink,e.networkName),c=(e.onShareWindowClose,e.openShareDialogOnClick,e.opts,e.resetButtonStyle),s=e.style,u=(e.url,e.windowHeight,e.windowPosition,e.windowWidth,k(e,["beforeOnClick","children","className","disabled","disabledStyle","forwardedRef","networkLink","networkName","onShareWindowClose","openShareDialogOnClick","opts","resetButtonStyle","style","url","windowHeight","windowPosition","windowWidth"])),d=b()("react-share__ShareButton",{"react-share__ShareButton--disabled":!!r,disabled:!!r},n),f=v(v(c?{backgroundColor:"transparent",border:"none",padding:0,font:"inherit",color:"inherit",cursor:"pointer"}:{},s),r&&o);return l.createElement("button",v({},u,{"aria-label":u["aria-label"]||i,className:d,onClick:this.handleClick,ref:a,style:f}),t)},t.defaultProps={disabledStyle:{opacity:.6},openShareDialogOnClick:!0,resetButtonStyle:!0},t}(l.Component),P=C,z=function(){return z=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},z.apply(this,arguments)};var x=function(e,t,n,r){function o(o,a){var i=n(o),c=z({},o);return Object.keys(i).forEach((function(e){delete c[e]})),l.createElement(P,z({},r,c,{forwardedRef:a,networkName:e,networkLink:t,opts:n(o)}))}return o.displayName="ShareButton-"+e,(0,l.forwardRef)(o)};var H=x("email",(function(e,t){var n=t.subject,r=t.body,o=t.separator;return"mailto:"+h({subject:n,body:r?r+o+e:e})}),(function(e){return{subject:e.subject,body:e.body,separator:e.separator||" "}}),{openShareDialogOnClick:!1,onClick:function(e,t){window.location.href=t}}),M=function(){return M=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},M.apply(this,arguments)},A=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n};function L(e){var t=function(t){var n=t.bgStyle,r=t.borderRadius,o=t.iconFillColor,a=t.round,i=t.size,c=A(t,["bgStyle","borderRadius","iconFillColor","round","size"]);return l.createElement("svg",M({viewBox:"0 0 64 64",width:i,height:i},c),a?l.createElement("circle",{cx:"32",cy:"32",r:"31",fill:e.color,style:n}):l.createElement("rect",{width:"64",height:"64",rx:r,ry:r,fill:e.color,style:n}),l.createElement("path",{d:e.path,fill:o}))};return t.defaultProps={bgStyle:{},borderRadius:0,iconFillColor:"white",size:64},t}var R=L({color:"#7f7f7f",networkName:"email",path:"M17,22v20h30V22H17z M41.1,25L32,32.1L22.9,25H41.1z M20,39V26.6l12,9.3l12-9.3V39H20z"}),I=function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},e(t,n)};return function(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),W=function(e){function t(t){var n=e.call(this,t)||this;return n.name="AssertionError",n}return I(t,e),t}(Error);function F(e,t){if(!e)throw new W(t)}var q=x("facebook",(function(e,t){var n=t.quote,r=t.hashtag;return F(e,"facebook.url"),"https://www.facebook.com/sharer/sharer.php"+h({u:e,quote:n,hashtag:r})}),(function(e){return{quote:e.quote,hashtag:e.hashtag}}),{windowWidth:550,windowHeight:400}),T=L({color:"#3b5998",networkName:"facebook",path:"M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z"});var D=x("twitter",(function(e,t){var n=t.title,r=t.via,o=t.hashtags,a=void 0===o?[]:o,l=t.related,i=void 0===l?[]:l;return F(e,"twitter.url"),F(Array.isArray(a),"twitter.hashtags is not an array"),F(Array.isArray(i),"twitter.related is not an array"),"https://twitter.com/share"+h({url:e,text:n,via:r,hashtags:a.length>0?a.join(","):void 0,related:i.length>0?i.join(","):void 0})}),(function(e){return{hashtags:e.hashtags,title:e.title,via:e.via,related:e.related}}),{windowWidth:550,windowHeight:400}),U=L({color:"#00aced",networkName:"twitter",path:"M48,22.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6 C41.7,19.8,40,19,38.2,19c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5c-5.5-0.3-10.3-2.9-13.5-6.9c-0.6,1-0.9,2.1-0.9,3.3 c0,2.3,1.2,4.3,2.9,5.5c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1c2.9,1.9,6.4,2.9,10.1,2.9c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C46,24.5,47.1,23.4,48,22.1z"});var B=x("linkedin",(function(e,t){var n=t.title,r=t.summary,o=t.source;return F(e,"linkedin.url"),"https://linkedin.com/shareArticle"+h({url:e,mini:"true",title:n,summary:r,source:o})}),(function(e){return{title:e.title,summary:e.summary,source:e.source}}),{windowWidth:750,windowHeight:600}),V=L({color:"#007fb1",networkName:"linkedin",path:"M20.4,44h5.4V26.6h-5.4V44z M23.1,18c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1 c1.7,0,3.1-1.4,3.1-3.1C26.2,19.4,24.8,18,23.1,18z M39.5,26.2c-2.6,0-4.4,1.4-5.1,2.8h-0.1v-2.4h-5.2V44h5.4v-8.6 c0-2.3,0.4-4.5,3.2-4.5c2.8,0,2.8,2.6,2.8,4.6V44H46v-9.5C46,29.8,45,26.2,39.5,26.2z"});var G=x("reddit",(function(e,t){var n=t.title;return F(e,"reddit.url"),"https://www.reddit.com/submit"+h({url:e,title:n})}),(function(e){return{title:e.title}}),{windowWidth:660,windowHeight:460,windowPosition:"windowCenter"}),Z=L({color:"#ff4500",networkName:"reddit",path:"m 52.8165,31.942362 c 0,-2.4803 -2.0264,-4.4965 -4.5169,-4.4965 -1.2155,0 -2.3171,0.4862 -3.128,1.2682 -3.077,-2.0247 -7.2403,-3.3133 -11.8507,-3.4782 l 2.5211,-7.9373 6.8272,1.5997 -0.0102,0.0986 c 0,2.0281 1.6575,3.6771 3.6958,3.6771 2.0366,0 3.6924,-1.649 3.6924,-3.6771 0,-2.0281 -1.6575,-3.6788 -3.6924,-3.6788 -1.564,0 -2.8968,0.9758 -3.4357,2.3443 l -7.3593,-1.7255 c -0.3213,-0.0782 -0.6477,0.1071 -0.748,0.4233 L 32,25.212062 c -4.8246,0.0578 -9.1953,1.3566 -12.41,3.4425 -0.8058,-0.7446 -1.8751,-1.2104 -3.0583,-1.2104 -2.4905,0 -4.5152,2.0179 -4.5152,4.4982 0,1.649 0.9061,3.0787 2.2389,3.8607 -0.0884,0.4794 -0.1462,0.9639 -0.1462,1.4569 0,6.6487 8.1736,12.0581 18.2223,12.0581 10.0487,0 18.224,-5.4094 18.224,-12.0581 0,-0.4658 -0.0493,-0.9248 -0.1275,-1.377 1.4144,-0.7599 2.3885,-2.2304 2.3885,-3.9406 z m -29.2808,3.0872 c 0,-1.4756 1.207,-2.6775 2.6894,-2.6775 1.4824,0 2.6877,1.2019 2.6877,2.6775 0,1.4756 -1.2053,2.6758 -2.6877,2.6758 -1.4824,0 -2.6894,-1.2002 -2.6894,-2.6758 z m 15.4037,7.9373 c -1.3549,1.3481 -3.4816,2.0043 -6.5008,2.0043 l -0.0221,-0.0051 -0.0221,0.0051 c -3.0209,0 -5.1476,-0.6562 -6.5008,-2.0043 -0.2465,-0.2448 -0.2465,-0.6443 0,-0.8891 0.2465,-0.2465 0.6477,-0.2465 0.8942,0 1.105,1.0999 2.9393,1.6337 5.6066,1.6337 l 0.0221,0.0051 0.0221,-0.0051 c 2.6673,0 4.5016,-0.5355 5.6066,-1.6354 0.2465,-0.2465 0.6477,-0.2448 0.8942,0 0.2465,0.2465 0.2465,0.6443 0,0.8908 z m -0.3213,-5.2615 c -1.4824,0 -2.6877,-1.2002 -2.6877,-2.6758 0,-1.4756 1.2053,-2.6775 2.6877,-2.6775 1.4824,0 2.6877,1.2019 2.6877,2.6775 0,1.4756 -1.2053,2.6758 -2.6877,2.6758 z"});var K=x("pocket",(function(e,t){var n=t.title;return F(e,"pocket.url"),"https://getpocket.com/save"+h({url:e,title:n})}),(function(e){return{title:e.title}}),{windowWidth:500,windowHeight:500}),Y=L({color:"#EF3F56",networkName:"pocket",path:"M41.084 29.065l-7.528 7.882a2.104 2.104 0 0 1-1.521.666 2.106 2.106 0 0 1-1.522-.666l-7.528-7.882c-.876-.914-.902-2.43-.065-3.384.84-.955 2.228-.987 3.1-.072l6.015 6.286 6.022-6.286c.88-.918 2.263-.883 3.102.071.841.938.82 2.465-.06 3.383l-.015.002zm6.777-10.976C47.463 16.84 46.361 16 45.14 16H18.905c-1.2 0-2.289.82-2.716 2.044-.125.363-.189.743-.189 1.125v10.539l.112 2.096c.464 4.766 2.73 8.933 6.243 11.838.06.053.125.102.19.153l.04.033c1.882 1.499 3.986 2.514 6.259 3.014a14.662 14.662 0 0 0 6.13.052c.118-.042.235-.065.353-.087.03 0 .065-.022.098-.042a15.395 15.395 0 0 0 6.011-2.945l.039-.045.18-.153c3.502-2.902 5.765-7.072 6.248-11.852L48 29.674v-10.52c0-.366-.041-.728-.161-1.08l.022.015z"}),X=n(5431),$=n(9168);var J=e=>{const{toc:t,isOutside:n}=e;return l.createElement("div",{className:"toc "+(n?"outside":"inside"),dangerouslySetInnerHTML:{__html:t}})},Q=n(7665),ee=n(4833),te=n.n(ee);var ne=e=>{var t;const o="undefined"==typeof window,{data:u,pageContext:h}=e,y=(0,c.v9)((e=>e.isMobile)),{0:w,1:b}=(0,l.useState)([]),{0:g,1:v}=(0,l.useState)(!1),{0:E,1:O}=(0,l.useState)(null),[k]=(0,X.If)(),{markdownRemark:j}=u,{frontmatter:S,html:N,tableOfContents:_,fields:C,excerpt:P,timeToRead:z}=j,{title:x,date:M,tags:A,keywords:L}=S;let I=S.update;1===Number(null===(t=I)||void 0===t?void 0:t.split(",")[1])&&(I=null);const{slug:W}=C,{series:F}=h,{enablePostOfContents:ee,disqusShortname:ne,enableSocialShare:re}=te(),oe=ee&&""!==_,ae=re,le=A.map((e=>l.createElement("li",{key:e,className:"blog-post-tag"},l.createElement(s.Link,{to:"/tags#"+e},"#"+e)))),ie=F.map((e=>l.createElement("li",{key:e.slug+"-series-"+e.num,className:"series-item "+(W===e.slug?"current-series":"")},l.createElement(s.Link,{to:e.slug},l.createElement("span",null,e.title),l.createElement("div",{className:"icon-wrap"},W===e.slug?l.createElement(f.G,{icon:p.EyR}):null))))),ce=(0,l.useCallback)(((e,t)=>{const n=new Set;for(const o of[].concat((0,r.Z)(e),(0,r.Z)(t)))n.add(o);return Array.from(n)}),[]),se=()=>{const e=l.lazy((()=>n.e(99).then(n.bind(n,5099))));O(l.createElement(e,{slug:W,title:x}))};return(0,l.useEffect)((()=>{if(y){const e=document.querySelector(".ad");if(e){const t=window.innerHeight>window.innerWidth?window.innerWidth:window.innerHeight;e.style.maxWidth=t+"px",e.style.display="flex",e.style.justifyContent="flex-end"}}}),[y]),(0,l.useEffect)((()=>{const e=()=>{if(w){const e=w.filter((e=>e<window.pageYOffset)).length-1,t=document.querySelectorAll(".toc.outside li a");for(const n in Array.from(t))parseInt(n,10)===e?t[n].style.opacity="1":t[n].style.opacity="0.4"}};return oe&&document.addEventListener("scroll",e),()=>{oe&&document.removeEventListener("scroll",e)}}),[w]),(0,l.useEffect)((()=>{O(null),setTimeout((()=>{se()}),1e3)}),[k]),(0,l.useEffect)((()=>{var e,t;const n=null!==(e=null===(t=document.querySelector(".blog-post"))||void 0===t?void 0:t.getBoundingClientRect().top)&&void 0!==e?e:0,r=()=>document.removeEventListener("scroll",o),o=a()((()=>{var e,t;const o=null!==(e=null===(t=document.querySelector(".blog-post"))||void 0===t?void 0:t.getBoundingClientRect().height)&&void 0!==e?e:1/0;window.scrollY+1.75*window.innerHeight-n>o&&(se(),r())}),250);o(),document.addEventListener("scroll",o);const l=Array.from(document.querySelectorAll("h2, h3")),i=window.innerHeight<500?100:Math.floor(window.innerHeight/5),c=l.map((e=>e.offsetTop-i));return b(c),()=>r()}),[]),l.createElement(l.Fragment,null,l.createElement(i.q,null,l.createElement("script",{async:!0,src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"}),l.createElement("script",{type:"application/ld+json"},'\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "datePublished": "'+d()(new Date(M)).toISOString()+'",\n  '+(I?'"dateModified": "'+d()(new Date(I)).toISOString()+'",':"")+'\n  "mainEntityOfPage": {\n    "@type": "WebPage",\n    "@id": "'+te().siteUrl+'"\n  },\n  "author": {\n    "@type": "Person",\n    "name": "'+te().name+'"\n  },\n  "headline": "'+x+'",\n  '+(te().profileImageFileName?'"publisher": {\n    "@type" : "organization",\n    "name" : "'+te().name+'",\n    "logo": {\n      "@type": "ImageObject",\n      "url": "'+te().siteUrl+n(6303)("./"+te().profileImageFileName)+'"\n    }\n  },\n  "image": ["'+te().siteUrl+n(6303)("./"+te().profileImageFileName)+'"]':'"publisher": {\n    "@type" : "organization",\n    "name" : "'+te().name+'"\n  },\n  "image": []')+"\n}\n")),l.createElement(Q.Z,{title:x,description:P,keywords:ce(L,A)}),l.createElement($.Z,null,l.createElement("div",{className:"blog-post-container"},l.createElement("div",{className:"blog-post"},l.createElement("div",{className:"date-wrap"},l.createElement("span",{className:"write-date"},M," • ",z," min read ☕"),l.createElement("span",null," "),I?l.createElement(l.Fragment,null,l.createElement("span",null,"("),l.createElement("span",{className:"update-date"},"Last updated: "+I),l.createElement("span",null,")")):null),l.createElement("h1",{className:"blog-post-title"},x),l.createElement("div",{className:"blog-post-info"},A.length&&"undefined"!==A[0]?l.createElement(l.Fragment,null,l.createElement("span",{className:"dot"},"·"),l.createElement("ul",{className:"blog-post-tag-list"},le)):null,oe?l.createElement("div",{className:"blog-post-inside-toc"},l.createElement("div",{className:"toc-button",role:"button",onClick:()=>{v((e=>!e))}},l.createElement(f.G,{icon:p.gf$}))):null),oe?l.createElement("div",{className:"inside-toc-wrap",style:{display:g?"flex":"none"}},l.createElement(J,{isOutside:!1,toc:_})):null,F.length>1?l.createElement(l.Fragment,null,l.createElement("div",{className:"series"},l.createElement("div",{className:"series-head"},l.createElement("span",{className:"head"},"Post Series"),l.createElement("div",{className:"icon-wrap"},l.createElement(f.G,{icon:p.Krp}))),l.createElement("ul",{className:"series-list"},ie))):null,l.createElement("div",{className:"blog-post-content",dangerouslySetInnerHTML:{__html:N}})),ae?l.createElement("div",{className:"social-share"},l.createElement("ul",null,l.createElement("li",{className:"social-share-item email"},l.createElement(H,{url:te().siteUrl+W},l.createElement(R,{size:24,round:!0}))),l.createElement("li",{className:"social-share-item facebook"},l.createElement(q,{url:te().siteUrl+W},l.createElement(T,{size:24,round:!0}))),l.createElement("li",{className:"social-share-item twitter"},l.createElement(D,{url:te().siteUrl+W},l.createElement(U,{size:24,round:!0}))),l.createElement("li",{className:"social-share-item linkedin"},l.createElement(B,{url:te().siteUrl+W},l.createElement(V,{size:24,round:!0}))),l.createElement("li",{className:"social-share-item reddit"},l.createElement(G,{url:te().siteUrl+W},l.createElement(Z,{size:24,round:!0}))),l.createElement("li",{className:"social-share-item pocket"},l.createElement(K,{url:te().siteUrl+W},l.createElement(Y,{size:24,round:!0}))))):null,l.createElement(l.Fragment,null,l.createElement("aside",{className:"ad"},l.createElement(m.Z.Google,{client:te().googleAdsenseClient||"ca-pub-7954241517411559",slot:te().googleAdsenseSlot||"5214956675",style:{display:"block"},format:"auto",responsive:"true"})),o?null:l.createElement(l.Suspense,{fallback:l.createElement(l.Fragment,null)},E))),oe?l.createElement(J,{isOutside:!0,toc:_}):null))}},3631:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(9496),l=(r=a)&&r.__esModule?r:{default:r};function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var s=function(e){function t(){return i(this,t),c(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"render",value:function(){return l.default.createElement("div",{className:"adsbybaidu"},"TODO")}}]),t}(l.default.Component);t.default=s},4850:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=l(n(9496)),a=l(n(507));function l(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var s=function(e){function t(){return i(this,t),c(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),r(t,[{key:"componentDidMount",value:function(){window&&(window.adsbygoogle=window.adsbygoogle||[]).push({})}},{key:"render",value:function(){return o.default.createElement("ins",{className:this.props.className+" adsbygoogle",style:this.props.style,"data-ad-client":this.props.client,"data-ad-slot":this.props.slot,"data-ad-layout":this.props.layout,"data-ad-layout-key":this.props.layoutKey,"data-ad-format":this.props.format,"data-full-width-responsive":this.props.responsive})}}]),t}(o.default.Component);t.default=s,s.propTypes={className:a.default.string,style:a.default.object,client:a.default.string.isRequired,slot:a.default.string.isRequired,layout:a.default.string,layoutKey:a.default.string,format:a.default.string,responsive:a.default.string},s.defaultProps={className:"",style:{display:"block"},format:"auto",layout:"",layoutKey:"",responsive:"false"}},5259:function(e,t,n){"use strict";var r=a(n(4850)),o=a(n(3631));function a(e){return e&&e.__esModule?e:{default:e}}var l={Google:r.default,Baidu:o.default};t.Z=l}}]);
//# sourceMappingURL=component---src-templates-post-tsx.js.map