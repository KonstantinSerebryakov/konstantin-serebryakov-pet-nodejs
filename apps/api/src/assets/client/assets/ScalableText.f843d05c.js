import{Q as h}from"./QResizeObserver.db5737f9.js";import{l,r as t,_ as p,m as f,p as d,d as u,I as S,af as m}from"./index.3e935c67.js";const x=l({components:{},name:"ScalableText",props:{value:{type:String,required:!0}},setup(o,e){const s=t(null),r=t(null),n=t(!1),i=t(9999999),a=t(9999999),c=t(9999999);return{text:s,container:r,isScaled:n,baseFontSize:i,prevWidth1:a,prevWidth2:c}},methods:{onResize({height:o,width:e}){if(!this.text||!this.container||e===this.prevWidth2)return;this.prevWidth2=this.prevWidth1,this.prevWidth1=e;const s=this.text.offsetWidth;if(e>s&&!this.isScaled)return;const r=e/s,n=window.getComputedStyle(this.text,null).getPropertyValue("font-size"),i=parseInt(n.substring(0,n.length-2));this.isScaled||(this.isScaled=!0,this.baseFontSize=i);const a=Math.floor(i*r);this.text.style.fontSize=`${Math.max(1,Math.min(a-1,this.baseFontSize))}px`,this.container.style.lineHeight=`${Math.max(1,Math.min(a-1,this.baseFontSize))}px`}}}),z={ref:"container"};function v(o,e,s,r,n,i){return f(),d("div",z,[u(h,{onResize:o.onResize},null,8,["onResize"]),S("span",{ref:"text"},m(o.value),513)],512)}var g=p(x,[["render",v]]);export{g as S};
