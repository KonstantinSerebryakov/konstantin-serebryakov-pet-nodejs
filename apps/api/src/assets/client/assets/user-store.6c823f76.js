var f=Object.defineProperty;var U=(t,a,e)=>a in t?f(t,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[a]=e;var o=(t,a,e)=>(U(t,typeof a!="symbol"?a+"":a,e),e);import{ab as y,ac as I,w as m,y as l,E as d,c as h}from"./index.3e935c67.js";import{a as c}from"./axios.ae2e2349.js";import{S as s}from"./store-state.enum.0423141e.js";class E{constructor(a){o(this,"id");o(this,"email");o(this,"isVerified");o(this,"passwordHash");this.id=a.id,this.email=a.email,this.isVerified=a.isVerified,this.passwordHash=a.passwordHash}getPublic(){return{email:this.email,isVerified:this.isVerified}}}class w{static async getUser(a){const e="users/info",r=await this.fetchApiGet(e),i=new E(r);return u.emit(L.GET_USER_SUCCESS,i),i}static async fetchApiGet(a){return await c.get(a).then(r=>{if(r.status===200)return r.data.user;throw new Error(`${r.status}`)})}static async fetchApiPost(a,e){return await c.post(a,e).then(i=>{if(i.status===200||i.status===201)return!0;throw new Error(`${i.status}`)})}static async fetchApiPut(a,e){return await c.put(a,e).then(i=>{if(i.status===200||i.status===201)return!0;throw new Error(`${i.status}`)})}static async fetchApiDelete(a){return await c.delete(a).then(r=>{if(r.status===200||r.status===204)return!0;throw new Error(`${r.status}`)})}}const S="user-store";async function $(t){localStorage.setItem(S,JSON.stringify(t))}async function A(){const t=localStorage.getItem(S);if(!t)return null;const a=JSON.parse(t);return new E(a)}async function C(){localStorage.removeItem(S)}const u=y();var L=(t=>(t.FULLFILLED="FULLFILLED",t.UPLOAD_USER_SUCCESS="UPLOAD_USER_SUCCESS",t.GET_USER_SUCCESS="GET_USER_SUCCESS",t))(L||{});const g=I("user",{state:()=>({data:null,dataState:s.INITIAL}),getters:{isSynchronized:t=>h(()=>t.dataState===s.FULLFILLED),isInitial:t=>h(()=>t.dataState===s.INITIAL)},actions:{async synchronizeByEmail(t,a=!1){this.$state.data&&!a||(await this.synchronizeWithLocalStorage(),!this.$state.data&&(this.$state.dataState=s.PENDING_REMOTE,await w.getUser(t)))},async synchronizeWithLocalStorage(t=!1){if(!t&&this.$state.dataState!==s.INITIAL&&this.$state.dataState!==s.CLEARED&&this.$state.dataState!==s.ERROR)return;const a=this.$state.dataState===s.INITIAL;this.$state.dataState=s.PENDING_BROWSER_STORAGE;const e=await A();if(e){if(a){this.synchronizeByEmail(e.email);return}this.$state.data=e,this.$state.dataState=s.FULLFILLED}else this.$state.data=null},async storeLocalStorage(){const t=this.$state.data;t?$(t).then(()=>{this.$state.dataState=s.FULLFILLED}):C().then(()=>{this.$state.dataState=s.CLEARED})}}}),n=g();m(n.isSynchronized,async(t,a)=>{t&&u.emit("FULLFILLED")});u.on("GET_USER_SUCCESS",t=>{const a=t;n.$state.data=a,n.storeLocalStorage()});l.on(d.LOGIN_SUCCESS,t=>{const a=t;n.synchronizeByEmail(a.email)});l.on(d.LOGOUT_SUCCESS,()=>{n.$state.data=null,n.storeLocalStorage()});export{L as U,u as a,E as b,g as u};