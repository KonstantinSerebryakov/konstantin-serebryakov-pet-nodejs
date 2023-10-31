var m=Object.defineProperty;var L=(e,t,i)=>t in e?m(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var a=(e,t,i)=>(L(e,typeof t!="symbol"?t+"":t,i),i);import{a as c}from"./axios.ae2e2349.js";import{ab as I,ac as p,w as g,y as C,E as D,c as f}from"./index.3e935c67.js";import{S as h}from"./store-state.enum.0423141e.js";class d{constructor(t){a(this,"id");a(this,"profileId");a(this,"firstName");a(this,"lastName");a(this,"birthday");this.id=t.id,this.profileId=t.profileId,this.firstName=t.firstName,this.lastName=t.lastName,this.birthday=t.birthday}getPublic(){return{firstName:this.firstName,lastName:this.lastName,birthday:this.birthday}}getFirstName(){const t=this.firstName;return t&&t.length>0?t:"Not Given"}getLastName(){const t=this.lastName;return t&&t.length>0?t:"Not Given"}getFullNameOrEmpty(){const t=this.firstName,i=this.lastName;return t&&i&&t.length>0&&i.length>0?t+" "+i:""}getFullName(){const t=this.getFullNameOrEmpty();return t.length>0?t:"Not Given"}getBirthdayString(t="."){return this.birthday?this.birthday.getFullYear()+t+(this.birthday.getMonth()+1)+t+this.birthday.getDate():"Not Given"}static getEmpty(){return new d({firstName:"",lastName:"",birthday:null})}}class N{constructor(t){a(this,"id");a(this,"profileId");a(this,"firstName");a(this,"lastName");a(this,"birthday",{day:null,month:null,year:null});this.id=t.id,this.profileId=t.profileId,this.firstName=t.firstName,this.lastName=t.lastName,this.setBirthday(t.birthday)}setBirthday(t){t?this.birthday={day:t.getDate(),month:t.getMonth()+1,year:t.getFullYear()}:this.birthday={day:null,month:null,year:null}}getBirthdayDate(){if(!this.birthday||!this.birthday.day||!this.birthday.month||!this.birthday.year)return null;const t=this.birthday.year.toString().padStart(4,"0"),i=this.birthday.month.toString().padStart(2,"0"),s=this.birthday.day.toString().padStart(2,"0"),r=new Date(`${t}-${i}-${s}T00:00:00Z`);return r.getFullYear()===this.birthday.year&&r.getMonth()===this.birthday.month-1&&r.getDate()===this.birthday.day?r:null}getCredentialEntity(){return new d({id:this.id,profileId:this.profileId,firstName:this.firstName,lastName:this.lastName,birthday:this.getBirthdayDate()})}static getEmpty(){return new N(d.getEmpty())}}class P{constructor(t){a(this,"id");a(this,"iconUrl");a(this,"name");this.id=t.id,this.iconUrl=t.iconUrl,this.name=t.name}getPublic(){return{iconUrl:this.iconUrl,name:this.name}}}class E{constructor(t){a(this,"id");a(this,"profileId");a(this,"socialMediaVariant");a(this,"isActive");a(this,"link");this.id=t.id,this.profileId=t.profileId,this.socialMediaVariant=new P(t.socialMediaVariant),this.isActive=t.isActive,this.link=t.link}getPublicSelf(){return{isActive:this.isActive,link:this.link}}getPublicNested(){return{socialMediaVariant:this.socialMediaVariant.getPublic(),isActive:this.isActive,link:this.link}}}class A{constructor(t){a(this,"id");a(this,"profileId");a(this,"position");a(this,"about");this.id=t.id,this.profileId=t.profileId,this.position=t.position,this.about=t.about}getPublic(){return{position:this.position,about:this.about}}}class S{constructor(t){a(this,"id");a(this,"userId");a(this,"socialMediaNodes");a(this,"credential");a(this,"essentialInfo");var i;this.id=t.id,this.userId=t.userId,this.socialMediaNodes=(i=t.socialMediaNodes)==null?void 0:i.map(s=>new E(s)),t.credential&&(this.credential=new d(t.credential)),t.essentialInfo&&(this.essentialInfo=new A(t.essentialInfo))}getPublicSelf(){return{userId:this.userId}}getPublicNested(){var t,i;return{userId:this.userId,socialMediaNodes:(t=this.socialMediaNodes)==null?void 0:t.map(s=>s.getPublicNested()),credential:(i=this.credential)==null?void 0:i.getPublic()}}getCredentialClone(){return this.credential?new d(this.credential):this.credential}getSocialMediaNodesClone(){return this.socialMediaNodes?this.socialMediaNodes.map(t=>new E(t)):this.socialMediaNodes}}const u="profile-store";async function U(e){sessionStorage.setItem(u,JSON.stringify(e))}function _(){const e=sessionStorage.getItem(u);if(!e)return null;const t=JSON.parse(e);if(t.credential&&t.credential.birthday){const i=t.credential.birthday.toString();t.credential.birthday=new Date(i)}return new S(t)}async function b(){sessionStorage.removeItem(u)}const o=I();var l=(e=>(e.PROFILE_NOT_DEFINED="PROFILE_NOT_DEFINED",e.UPLOAD_PROFILE_NESTED_SUCCESS="UPLOAD_PROFILE_SUCCESS",e.UPLOAD_CREDENTIAL_SUCCESS="UPLOAD_CREDENTIAL_SUCCESS",e.UPLOAD_SOCIAL_MEDIA_NODES_SUCCESS="UPLOAD_SOCIAL_MEDIA_NODES_SUCCESS",e.DELETE_PROFILE_SUCCESS="DELETE_PROFILE_SUCCESS",e.GET_PROFILE_SUCCESS="GET_PROFILE_SUCCESS",e.FULLFILLED="FULLFILLED",e))(l||{});const w=p("profile",{state:()=>({data:null,dataState:h.INITIAL}),getters:{isSynchronized:e=>f(()=>e.dataState===h.FULLFILLED),isInitial:e=>f(()=>e.dataState===h.INITIAL)},actions:{async synchronizeDefault(e=!1){this.$state.data&&!e||(await this.synchronizeWithSessionStorage(),!this.$state.data&&(this.$state.dataState=h.PENDING_REMOTE,await y.getProfileDefault()))},async synchronizeById(e,t=!1){this.$state.data&&!t||(await this.synchronizeWithSessionStorage(),!this.$state.data&&(this.$state.dataState=h.PENDING_REMOTE,await y.getProfile(e)))},synchronizeWithSessionStorage(e=!1){if(!e&&this.$state.dataState!==h.INITIAL&&this.$state.dataState!==h.CLEARED&&this.$state.dataState!==h.ERROR)return;this.$state.dataState=h.PENDING_BROWSER_STORAGE;const t=_();t?(this.$state.data=t,this.$state.dataState=h.FULLFILLED):this.$state.data=null},async storeSessionStorage(){const e=this.$state.data;e?U(e).then(()=>{this.$state.dataState=h.FULLFILLED}):b().then(()=>{this.$state.dataState=h.CLEARED})}}}),n=w();g(n.isSynchronized,async(e,t)=>{e&&o.emit("FULLFILLED")});o.on("PROFILE_NOT_DEFINED",()=>{n.synchronizeWithSessionStorage()});o.on("UPLOAD_PROFILE_SUCCESS",e=>{const t=e;n.$state.data=t,n.storeSessionStorage()});o.on("UPLOAD_CREDENTIAL_SUCCESS",e=>{const t=e;n.$state.data&&(n.$state.data.credential=t,n.storeSessionStorage())});o.on("UPLOAD_SOCIAL_MEDIA_NODES_SUCCESS",e=>{const t=e;n.$state.data&&(n.$state.data.socialMediaNodes=t,n.storeSessionStorage())});o.on("GET_PROFILE_SUCCESS",e=>{const t=e;n.$state.data=t,n.storeSessionStorage()});o.on("DELETE_PROFILE_SUCCESS",()=>{n.$state.data=null,n.storeSessionStorage()});C.on(D.LOGOUT_SUCCESS,()=>{n.$state.data=null,n.storeSessionStorage()});class y{static async getProfile(t){const i=`profiles/profile/${t}`,s=await this.fetchApiGet(i),r=new S(s);return o.emit(l.GET_PROFILE_SUCCESS,s),r}static async getProfilesList(){const t="profiles/list/essential";return(await this.fetchApiGet(t,"profiles")).map(r=>new S(r))}static async getProfileDefault(){const t="profiles/default",i=await this.fetchApiGet(t),s=new S(i);return o.emit(l.GET_PROFILE_SUCCESS,s),s}static async updateProfile(t,i){const s=`profiles/profile/${t}/`,r=await this.fetchApiPut(s,i);return o.emit(l.UPLOAD_PROFILE_NESTED_SUCCESS,i),r}static async updateCredential(t,i){const s=`profiles/profile/${t}/credential`,r=await this.fetchApiPut(s,i);return o.emit(l.UPLOAD_CREDENTIAL_SUCCESS,i),r}static async updateSocialMediaNodes(t,i){const s=`profiles/profile/${t}/social-media-nodes`,r=await this.fetchApiPost(s,i);return o.emit(l.UPLOAD_SOCIAL_MEDIA_NODES_SUCCESS,i),r}static async deleteProfile(t){const i=`profiles/profile/${t}`,s=await this.fetchApiDelete(i);return o.emit(l.DELETE_PROFILE_SUCCESS),s}static async createProfile(){const t="profiles/new";return await this.fetchApiPost(t)}static async fetchApiGet(t,i="profile"){return await c.get(t).then(r=>{if(r.status===200)return r.data[i];throw new Error(`${r.status}`)})}static async fetchApiPost(t,i){return await c.post(t,i).then(r=>{if(r.status===200||r.status===201)return!0;throw new Error(`${r.status}`)})}static async fetchApiPut(t,i){return await c.put(t,i).then(r=>{if(r.status===200||r.status===201)return!0;throw new Error(`${r.status}`)})}static async fetchApiDelete(t){return await c.delete(t).then(s=>{if(s.status===200||s.status===204)return!0;throw new Error(`${s.status}`)})}}export{N as C,S as P,y as a,l as b,d as c,o as p,w as u};