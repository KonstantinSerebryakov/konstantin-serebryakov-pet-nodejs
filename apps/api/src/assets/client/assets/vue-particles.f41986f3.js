import{l as c,n as p,m as d,p as l,f as u}from"./index.3e935c67.js";import{t as o}from"./index.52ccf73b.js";let i;const m=c({props:{id:{type:String,required:!0},options:{type:Object},url:{type:String},particlesLoaded:{type:Function},particlesInit:{type:Function}},mounted(){p(async()=>{if(!this.id)throw new Error("Prop 'id' is required!");o.init(),this.particlesInit&&await this.particlesInit(o),i=await o.load({id:this.id,url:this.url,options:this.options}),this.particlesLoaded&&i&&this.particlesLoaded(i)})},unmounted(){i&&(i.destroy(),i=void 0)}}),f=(t,r)=>{const e=t.__vccOpts||t;for(const[s,n]of r)e[s]=n;return e},h=["id"];function y(t,r,e,s,n,P){return d(),l("div",{id:t.id},null,8,h)}const a=f(m,[["render",y]]),v=t=>{t.component("vue-particles",a),t.component("Particles",a)};var I=u(({app:t})=>{t.use(v)});export{I as default};
