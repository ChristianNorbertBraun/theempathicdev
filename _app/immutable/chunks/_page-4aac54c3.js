import{_ as n}from"./preload-helper-41c905a7.js";import{s as l}from"./slugFromPath-088efb14.js";import{H as m}from"./control-e7f5239e.js";function p(r,o){return new m(r,o)}new TextEncoder;const _=!0,u=async({params:r})=>{var s;const o=Object.assign({"/src/blog/creating-features-in-existing-code.md":()=>n(()=>import("./creating-features-in-existing-code-b5945196.js"),["./creating-features-in-existing-code-b5945196.js","./index-a710900e.js"],import.meta.url),"/src/blog/default-implementations-in-protocols.md":()=>n(()=>import("./default-implementations-in-protocols-c2b2e70b.js"),["./default-implementations-in-protocols-c2b2e70b.js","./index-a710900e.js"],import.meta.url)});let e={};for(const[a,i]of Object.entries(o))if(l(a)===r.slug){e={path:a,resolver:i};break}const t=await((s=e==null?void 0:e.resolver)==null?void 0:s.call(e));if(!t||!t.metadata.published)throw p(404);return{component:t.default,frontmatter:t.metadata}},g=Object.freeze(Object.defineProperty({__proto__:null,load:u,prerender:_},Symbol.toStringTag,{value:"Module"}));export{g as _,u as l,_ as p};
