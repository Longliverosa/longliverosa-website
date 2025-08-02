import{r as h,j as c,u as Rt}from"./index-C5yKEohB.js";import{addDoc as be,collection as ye,getFirestore as Le,serverTimestamp as fe}from"./index.esm-C4swlPk-.js";import{b as he,g as je,o as xt}from"./firebase-CIgY3-Cu.js";import{g as Tt,c as oe,_ as vt,A as St,i as Be,p as Ut,u as At,B as Et,e as Ct,F as Nt,w as It,C as Pt,r as Ae,S as Ot,y as Fe}from"./index.esm-D_XDM9Qn.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e="firebasestorage.googleapis.com",Me="storageBucket",Dt=120*1e3,Lt=600*1e3,jt=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v extends Nt{constructor(e,n,s=0){super(me(e),`Firebase Storage: ${n} (${me(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,v.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return me(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var R;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(R||(R={}));function me(t){return"storage/"+t}function ke(){const t="An unknown error occurred, please check the error payload for server response.";return new v(R.UNKNOWN,t)}function Bt(t){return new v(R.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function Ft(t){return new v(R.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function $t(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new v(R.UNAUTHENTICATED,t)}function Mt(){return new v(R.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function qt(t){return new v(R.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function qe(){return new v(R.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function ze(){return new v(R.CANCELED,"User canceled the upload/download.")}function zt(t){return new v(R.INVALID_URL,"Invalid URL '"+t+"'.")}function Ht(t){return new v(R.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function Wt(){return new v(R.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Me+"' property when initializing the app?")}function He(){return new v(R.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Gt(){return new v(R.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function Vt(){return new v(R.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Xt(t){return new v(R.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function we(t){return new v(R.INVALID_ARGUMENT,t)}function We(){return new v(R.APP_DELETED,"The Firebase app was deleted.")}function Kt(t){return new v(R.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function re(t,e){return new v(R.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function se(t){throw new v(R.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let s;try{s=F.makeFromUrl(e,n)}catch{return new F(e,"")}if(s.path==="")return s;throw Ht(e)}static makeFromUrl(e,n){let s=null;const r="([A-Za-z0-9.\\-_]+)";function o(x){x.path.charAt(x.path.length-1)==="/"&&(x.path_=x.path_.slice(0,-1))}const i="(/(.*))?$",l=new RegExp("^gs://"+r+i,"i"),a={bucket:1,path:3};function d(x){x.path_=decodeURIComponent(x.path)}const u="v[A-Za-z0-9_]+",m=n.replace(/[.]/g,"\\."),p="(/([^?#]*).*)?$",w=new RegExp(`^https?://${m}/${u}/b/${r}/o${p}`,"i"),b={bucket:1,path:3},y=n===$e?"(?:storage.googleapis.com|storage.cloud.google.com)":n,g="([^?#]*)",A=new RegExp(`^https?://${y}/${r}/${g}`,"i"),f=[{regex:l,indices:a,postModify:o},{regex:w,indices:b,postModify:d},{regex:A,indices:{bucket:1,path:2},postModify:d}];for(let x=0;x<f.length;x++){const N=f[x],I=N.regex.exec(e);if(I){const T=I[N.indices.bucket];let L=I[N.indices.path];L||(L=""),s=new F(T,L),N.postModify(s);break}}if(s==null)throw zt(e);return s}}class Yt{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(t,e,n){let s=1,r=null,o=null,i=!1,l=0;function a(){return l===2}let d=!1;function u(...g){d||(d=!0,e.apply(null,g))}function m(g){r=setTimeout(()=>{r=null,t(w,a())},g)}function p(){o&&clearTimeout(o)}function w(g,...A){if(d){p();return}if(g){p(),u.call(null,g,...A);return}if(a()||i){p(),u.call(null,g,...A);return}s<64&&(s*=2);let f;l===1?(l=2,f=0):f=(s+Math.random())*1e3,m(f)}let b=!1;function y(g){b||(b=!0,p(),!d&&(r!==null?(g||(l=2),clearTimeout(r),m(0)):g||(l=1)))}return m(0),o=setTimeout(()=>{i=!0,y(!0)},n),y}function Jt(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(t){return t!==void 0}function en(t){return typeof t=="function"}function tn(t){return typeof t=="object"&&!Array.isArray(t)}function pe(t){return typeof t=="string"||t instanceof String}function Ee(t){return Re()&&t instanceof Blob}function Re(){return typeof Blob<"u"}function Ce(t,e,n,s){if(s<e)throw we(`Invalid value for '${t}'. Expected ${e} or greater.`);if(s>n)throw we(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ie(t,e,n){let s=e;return n==null&&(s=`https://${e}`),`${n}://${s}/v0${t}`}function Ge(t){const e=encodeURIComponent;let n="?";for(const s in t)if(t.hasOwnProperty(s)){const r=e(s)+"="+e(t[s]);n=n+r+"&"}return n=n.slice(0,-1),n}var Z;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(Z||(Z={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ve(t,e){const n=t>=500&&t<600,r=[408,429].indexOf(t)!==-1,o=e.indexOf(t)!==-1;return n||r||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(e,n,s,r,o,i,l,a,d,u,m,p=!0,w=!1){this.url_=e,this.method_=n,this.headers_=s,this.body_=r,this.successCodes_=o,this.additionalRetryCodes_=i,this.callback_=l,this.errorCallback_=a,this.timeout_=d,this.progressCallback_=u,this.connectionFactory_=m,this.retry=p,this.isUsingEmulator=w,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((b,y)=>{this.resolve_=b,this.reject_=y,this.start_()})}start_(){const e=(s,r)=>{if(r){s(!1,new ce(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const i=l=>{const a=l.loaded,d=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(a,d)};this.progressCallback_!==null&&o.addUploadProgressListener(i),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(i),this.pendingConnection_=null;const l=o.getErrorCode()===Z.NO_ERROR,a=o.getStatus();if(!l||Ve(a,this.additionalRetryCodes_)&&this.retry){const u=o.getErrorCode()===Z.ABORT;s(!1,new ce(!1,null,u));return}const d=this.successCodes_.indexOf(a)!==-1;s(!0,new ce(d,o))})},n=(s,r)=>{const o=this.resolve_,i=this.reject_,l=r.connection;if(r.wasSuccessCode)try{const a=this.callback_(l,l.getResponse());Qt(a)?o(a):o()}catch(a){i(a)}else if(l!==null){const a=ke();a.serverResponse=l.getErrorText(),this.errorCallback_?i(this.errorCallback_(l,a)):i(a)}else if(r.canceled){const a=this.appDelete_?We():ze();i(a)}else{const a=qe();i(a)}};this.canceled_?n(!1,new ce(!1,null,!0)):this.backoffId_=Zt(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Jt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class ce{constructor(e,n,s){this.wasSuccessCode=e,this.connection=n,this.canceled=!!s}}function sn(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function rn(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function on(t,e){e&&(t["X-Firebase-GMPID"]=e)}function an(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function ln(t,e,n,s,r,o,i=!0,l=!1){const a=Ge(t.urlParams),d=t.url+a,u=Object.assign({},t.headers);return on(u,e),sn(u,n),rn(u,o),an(u,s),new nn(d,t.method,u,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,r,i,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cn(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function un(...t){const e=cn();if(e!==void 0){const n=new e;for(let s=0;s<t.length;s++)n.append(t[s]);return n.getBlob()}else{if(Re())return new Blob(t);throw new v(R.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function dn(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(t){if(typeof atob>"u")throw Xt("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class ge{constructor(e,n){this.data=e,this.contentType=n||null}}function pn(t,e){switch(t){case q.RAW:return new ge(Xe(e));case q.BASE64:case q.BASE64URL:return new ge(Ke(t,e));case q.DATA_URL:return new ge(mn(e),gn(e))}throw ke()}function Xe(t){const e=[];for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);if(s<=127)e.push(s);else if(s<=2047)e.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const o=s,i=t.charCodeAt(++n);s=65536|(o&1023)<<10|i&1023,e.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?e.push(239,191,189):e.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(e)}function fn(t){let e;try{e=decodeURIComponent(t)}catch{throw re(q.DATA_URL,"Malformed data URL.")}return Xe(e)}function Ke(t,e){switch(t){case q.BASE64:{const r=e.indexOf("-")!==-1,o=e.indexOf("_")!==-1;if(r||o)throw re(t,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case q.BASE64URL:{const r=e.indexOf("+")!==-1,o=e.indexOf("/")!==-1;if(r||o)throw re(t,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=hn(e)}catch(r){throw r.message.includes("polyfill")?r:re(t,"Invalid character found")}const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}class Ye{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw re(q.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=n[1]||null;s!=null&&(this.base64=_n(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=e.substring(e.indexOf(",")+1)}}function mn(t){const e=new Ye(t);return e.base64?Ke(q.BASE64,e.rest):fn(e.rest)}function gn(t){return new Ye(t).contentType}function _n(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e,n){let s=0,r="";Ee(e)?(this.data_=e,s=e.size,r=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),s=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),s=e.length),this.size_=s,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,n){if(Ee(this.data_)){const s=this.data_,r=dn(s,e,n);return r===null?null:new H(r)}else{const s=new Uint8Array(this.data_.buffer,e,n-e);return new H(s,!0)}}static getBlob(...e){if(Re()){const n=e.map(s=>s instanceof H?s.data_:s);return new H(un.apply(null,n))}else{const n=e.map(i=>pe(i)?pn(q.RAW,i).data:i.data_);let s=0;n.forEach(i=>{s+=i.byteLength});const r=new Uint8Array(s);let o=0;return n.forEach(i=>{for(let l=0;l<i.length;l++)r[o++]=i[l]}),new H(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ze(t){let e;try{e=JSON.parse(t)}catch{return null}return tn(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bn(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function yn(t,e){const n=e.split("/").filter(s=>s.length>0).join("/");return t.length===0?n:t+"/"+n}function Je(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(t,e){return e}class D{constructor(e,n,s,r){this.server=e,this.local=n||e,this.writable=!!s,this.xform=r||wn}}let ue=null;function kn(t){return!pe(t)||t.length<2?t:Je(t)}function xe(){if(ue)return ue;const t=[];t.push(new D("bucket")),t.push(new D("generation")),t.push(new D("metageneration")),t.push(new D("name","fullPath",!0));function e(o,i){return kn(i)}const n=new D("name");n.xform=e,t.push(n);function s(o,i){return i!==void 0?Number(i):i}const r=new D("size");return r.xform=s,t.push(r),t.push(new D("timeCreated")),t.push(new D("updated")),t.push(new D("md5Hash",null,!0)),t.push(new D("cacheControl",null,!0)),t.push(new D("contentDisposition",null,!0)),t.push(new D("contentEncoding",null,!0)),t.push(new D("contentLanguage",null,!0)),t.push(new D("contentType",null,!0)),t.push(new D("metadata","customMetadata",!0)),ue=t,ue}function Rn(t,e){function n(){const s=t.bucket,r=t.fullPath,o=new F(s,r);return e._makeStorageReference(o)}Object.defineProperty(t,"ref",{get:n})}function xn(t,e,n){const s={};s.type="file";const r=n.length;for(let o=0;o<r;o++){const i=n[o];s[i.local]=i.xform(s,e[i.server])}return Rn(s,t),s}function Qe(t,e,n){const s=Ze(e);return s===null?null:xn(t,s,n)}function Tn(t,e,n,s){const r=Ze(e);if(r===null||!pe(r.downloadTokens))return null;const o=r.downloadTokens;if(o.length===0)return null;const i=encodeURIComponent;return o.split(",").map(d=>{const u=t.bucket,m=t.fullPath,p="/b/"+i(u)+"/o/"+i(m),w=ie(p,n,s),b=Ge({alt:"media",token:d});return w+b})[0]}function et(t,e){const n={},s=e.length;for(let r=0;r<s;r++){const o=e[r];o.writable&&(n[o.server]=t[o.local])}return JSON.stringify(n)}class ee{constructor(e,n,s,r){this.url=e,this.method=n,this.handler=s,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t){if(!t)throw ke()}function Te(t,e){function n(s,r){const o=Qe(t,r,e);return W(o!==null),o}return n}function vn(t,e){function n(s,r){const o=Qe(t,r,e);return W(o!==null),Tn(o,r,t.host,t._protocol)}return n}function ae(t){function e(n,s){let r;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?r=Mt():r=$t():n.getStatus()===402?r=Ft(t.bucket):n.getStatus()===403?r=qt(t.path):r=s,r.status=n.getStatus(),r.serverResponse=s.serverResponse,r}return e}function tt(t){const e=ae(t);function n(s,r){let o=e(s,r);return s.getStatus()===404&&(o=Bt(t.path)),o.serverResponse=r.serverResponse,o}return n}function Sn(t,e,n){const s=e.fullServerUrl(),r=ie(s,t.host,t._protocol),o="GET",i=t.maxOperationRetryTime,l=new ee(r,o,Te(t,n),i);return l.errorHandler=tt(e),l}function Un(t,e,n){const s=e.fullServerUrl(),r=ie(s,t.host,t._protocol),o="GET",i=t.maxOperationRetryTime,l=new ee(r,o,vn(t,n),i);return l.errorHandler=tt(e),l}function An(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function nt(t,e,n){const s=Object.assign({},n);return s.fullPath=t.path,s.size=e.size(),s.contentType||(s.contentType=An(null,e)),s}function st(t,e,n,s,r){const o=e.bucketOnlyServerUrl(),i={"X-Goog-Upload-Protocol":"multipart"};function l(){let f="";for(let x=0;x<2;x++)f=f+Math.random().toString().slice(2);return f}const a=l();i["Content-Type"]="multipart/related; boundary="+a;const d=nt(e,s,r),u=et(d,n),m="--"+a+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+u+`\r
--`+a+`\r
Content-Type: `+d.contentType+`\r
\r
`,p=`\r
--`+a+"--",w=H.getBlob(m,s,p);if(w===null)throw He();const b={name:d.fullPath},y=ie(o,t.host,t._protocol),g="POST",A=t.maxUploadRetryTime,E=new ee(y,g,Te(t,n),A);return E.urlParams=b,E.headers=i,E.body=w.uploadData(),E.errorHandler=ae(e),E}class de{constructor(e,n,s,r){this.current=e,this.total=n,this.finalized=!!s,this.metadata=r||null}}function ve(t,e){let n=null;try{n=t.getResponseHeader("X-Goog-Upload-Status")}catch{W(!1)}return W(!!n&&(e||["active"]).indexOf(n)!==-1),n}function En(t,e,n,s,r){const o=e.bucketOnlyServerUrl(),i=nt(e,s,r),l={name:i.fullPath},a=ie(o,t.host,t._protocol),d="POST",u={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${s.size()}`,"X-Goog-Upload-Header-Content-Type":i.contentType,"Content-Type":"application/json; charset=utf-8"},m=et(i,n),p=t.maxUploadRetryTime;function w(y){ve(y);let g;try{g=y.getResponseHeader("X-Goog-Upload-URL")}catch{W(!1)}return W(pe(g)),g}const b=new ee(a,d,w,p);return b.urlParams=l,b.headers=u,b.body=m,b.errorHandler=ae(e),b}function Cn(t,e,n,s){const r={"X-Goog-Upload-Command":"query"};function o(d){const u=ve(d,["active","final"]);let m=null;try{m=d.getResponseHeader("X-Goog-Upload-Size-Received")}catch{W(!1)}m||W(!1);const p=Number(m);return W(!isNaN(p)),new de(p,s.size(),u==="final")}const i="POST",l=t.maxUploadRetryTime,a=new ee(n,i,o,l);return a.headers=r,a.errorHandler=ae(e),a}const Ne=256*1024;function Nn(t,e,n,s,r,o,i,l){const a=new de(0,0);if(i?(a.current=i.current,a.total=i.total):(a.current=0,a.total=s.size()),s.size()!==a.total)throw Gt();const d=a.total-a.current;let u=d;r>0&&(u=Math.min(u,r));const m=a.current,p=m+u;let w="";u===0?w="finalize":d===u?w="upload, finalize":w="upload";const b={"X-Goog-Upload-Command":w,"X-Goog-Upload-Offset":`${a.current}`},y=s.slice(m,p);if(y===null)throw He();function g(x,N){const I=ve(x,["active","final"]),T=a.current+u,L=s.size();let $;return I==="final"?$=Te(e,o)(x,N):$=null,new de(T,L,I==="final",$)}const A="POST",E=e.maxUploadRetryTime,f=new ee(n,A,g,E);return f.headers=b,f.body=y.uploadData(),f.progressCallback=l||null,f.errorHandler=ae(t),f}const j={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function _e(t){switch(t){case"running":case"pausing":case"canceling":return j.RUNNING;case"paused":return j.PAUSED;case"success":return j.SUCCESS;case"canceled":return j.CANCELED;case"error":return j.ERROR;default:return j.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e,n,s){if(en(e)||n!=null||s!=null)this.next=e,this.error=n??void 0,this.complete=s??void 0;else{const o=e;this.next=o.next,this.error=o.error,this.complete=o.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(t){return(...e)=>{Promise.resolve().then(()=>t(...e))}}class Pn{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Z.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Z.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Z.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,s,r,o){if(this.sent_)throw se("cannot .send() more than once");if(Be(e)&&s&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(n,e,!0),o!==void 0)for(const i in o)o.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,o[i].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw se("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw se("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw se("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw se("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class On extends Pn{initXhr(){this.xhr_.responseType="text"}}function Y(){return new On}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,n,s=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=n,this._metadata=s,this._mappings=xe(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=r=>{if(this._request=void 0,this._chunkMultiplier=1,r._codeEquals(R.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const o=this.isExponentialBackoffExpired();if(Ve(r.status,[]))if(o)r=qe();else{this.sleepTime=Math.max(this.sleepTime*2,jt),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=r,this._transition("error")}},this._metadataErrorHandler=r=>{this._request=void 0,r._codeEquals(R.CANCELED)?this.completeTransitions_():(this._error=r,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((r,o)=>{this._resolve=r,this._reject=o,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const e=this._transferred;return n=>this._updateProgress(e+n)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([n,s])=>{switch(this._state){case"running":e(n,s);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,n)=>{const s=En(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(s,Y,e,n);this._request=r,r.getPromise().then(o=>{this._request=void 0,this._uploadUrl=o,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((n,s)=>{const r=Cn(this._ref.storage,this._ref._location,e,this._blob),o=this._ref.storage._makeRequest(r,Y,n,s);this._request=o,o.getPromise().then(i=>{i=i,this._request=void 0,this._updateProgress(i.current),this._needToFetchStatus=!1,i.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=Ne*this._chunkMultiplier,n=new de(this._transferred,this._blob.size()),s=this._uploadUrl;this._resolveToken((r,o)=>{let i;try{i=Nn(this._ref._location,this._ref.storage,s,this._blob,e,this._mappings,n,this._makeProgressCallback())}catch(a){this._error=a,this._transition("error");return}const l=this._ref.storage._makeRequest(i,Y,r,o,!1);this._request=l,l.getPromise().then(a=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(a.current),a.finalized?(this._metadata=a.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){Ne*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,n)=>{const s=Sn(this._ref.storage,this._ref._location,this._mappings),r=this._ref.storage._makeRequest(s,Y,e,n);this._request=r,r.getPromise().then(o=>{this._request=void 0,this._metadata=o,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,n)=>{const s=st(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(s,Y,e,n);this._request=r,r.getPromise().then(o=>{this._request=void 0,this._metadata=o,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const n=this._transferred;this._transferred=e,this._transferred!==n&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const n=this._state==="paused";this._state=e,n&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=ze(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=_e(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,n,s,r){const o=new In(n||void 0,s||void 0,r||void 0);return this._addObserver(o),()=>{this._removeObserver(o)}}then(e,n){return this._promise.then(e,n)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const n=this._observers.indexOf(e);n!==-1&&this._observers.splice(n,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(n=>{this._notifyObserver(n)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(_e(this._state)){case j.SUCCESS:Q(this._resolve.bind(null,this.snapshot))();break;case j.CANCELED:case j.ERROR:const n=this._reject;Q(n.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(_e(this._state)){case j.RUNNING:case j.PAUSED:e.next&&Q(e.next.bind(e,this.snapshot))();break;case j.SUCCESS:e.complete&&Q(e.complete.bind(e))();break;case j.CANCELED:case j.ERROR:e.error&&Q(e.error.bind(e,this._error))();break;default:e.error&&Q(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e,n){this._service=e,n instanceof F?this._location=n:this._location=F.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new J(e,n)}get root(){const e=new F(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Je(this._location.path)}get storage(){return this._service}get parent(){const e=bn(this._location.path);if(e===null)return null;const n=new F(this._location.bucket,e);return new J(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw Kt(e)}}function Ln(t,e,n){t._throwIfRoot("uploadBytes");const s=st(t.storage,t._location,xe(),new H(e,!0),n);return t.storage.makeRequestWithTokens(s,Y).then(r=>({metadata:r,ref:t}))}function jn(t,e,n){return t._throwIfRoot("uploadBytesResumable"),new Dn(t,new H(e),n)}function Bn(t){t._throwIfRoot("getDownloadURL");const e=Un(t.storage,t._location,xe());return t.storage.makeRequestWithTokens(e,Y).then(n=>{if(n===null)throw Vt();return n})}function Fn(t,e){const n=yn(t._location.path,e),s=new F(t._location.bucket,n);return new J(t.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $n(t){return/^[A-Za-z]+:\/\//.test(t)}function Mn(t,e){return new J(t,e)}function rt(t,e){if(t instanceof Se){const n=t;if(n._bucket==null)throw Wt();const s=new J(n,n._bucket);return e!=null?rt(s,e):s}else return e!==void 0?Fn(t,e):t}function qn(t,e){if(e&&$n(e)){if(t instanceof Se)return Mn(t,e);throw we("To use ref(service, url), the first argument must be a Storage instance.")}else return rt(t,e)}function Ie(t,e){const n=e?.[Me];return n==null?null:F.makeFromBucketSpec(n,t)}function zn(t,e,n,s={}){t.host=`${e}:${n}`;const r=Be(e);r&&(Ut(`https://${t.host}/b`),At("Storage",!0)),t._isUsingEmulator=!0,t._protocol=r?"https":"http";const{mockUserToken:o}=s;o&&(t._overrideAuthToken=typeof o=="string"?o:Et(o,t.app.options.projectId))}class Se{constructor(e,n,s,r,o,i=!1){this.app=e,this._authProvider=n,this._appCheckProvider=s,this._url=r,this._firebaseVersion=o,this._isUsingEmulator=i,this._bucket=null,this._host=$e,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Dt,this._maxUploadRetryTime=Lt,this._requests=new Set,r!=null?this._bucket=F.makeFromBucketSpec(r,this._host):this._bucket=Ie(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=F.makeFromBucketSpec(this._url,e):this._bucket=Ie(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Ce("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Ce("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(Ct(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new J(this,e)}_makeRequest(e,n,s,r,o=!0){if(this._deleted)return new Yt(We());{const i=ln(e,this._appId,s,r,n,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(e,n){const[s,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,s,r).getPromise()}}const Pe="@firebase/storage",Oe="0.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ot="storage";function Hn(t,e,n){return t=oe(t),Ln(t,e,n)}function Wn(t,e,n){return t=oe(t),jn(t,e,n)}function it(t){return t=oe(t),Bn(t)}function at(t,e){return t=oe(t),qn(t,e)}function lt(t=Tt(),e){t=oe(t);const s=vt(t,ot).getImmediate({identifier:e}),r=St("storage");return r&&Gn(s,...r),s}function Gn(t,e,n,s={}){zn(t,e,n,s)}function Vn(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),s=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new Se(n,s,r,e,Ot)}function Xn(){It(new Pt(ot,Vn,"PUBLIC").setMultipleInstances(!0)),Ae(Pe,Oe,""),Ae(Pe,Oe,"esm2020")}Xn();const Kn=[{cmd:"/h1",desc:"Heading 1",example:"/h1{Heading}"},{cmd:"/h2",desc:"Heading 2",example:"/h2{Heading}"},{cmd:"/h3",desc:"Heading 3",example:"/h3{Heading}"},{cmd:"/b",desc:"Bold",example:"/b{bold text}"},{cmd:"/i",desc:"Italic",example:"/i{italic text}"},{cmd:"/u",desc:"Underline",example:"/u{underlined text}"},{cmd:"/s",desc:"Strikethrough",example:"/s{strikethrough}"},{cmd:"/code",desc:"html code",example:"/code{inline code}"},{cmd:"/pre",desc:"Code block or GitHub Page iframe",example:'/pre{js|console.log("hi");} or /pre{iframe|https://your-github-username.github.io/your-repo/}'},{cmd:"/ul",desc:"Bulleted list",example:"/ul{item1|item2|item3}"},{cmd:"/ol",desc:"Numbered list",example:"/ol{item1|item2|item3}"},{cmd:"/toggle",desc:"Toggle (Notion-style)",example:"/toggle{Title|Content}"},{cmd:"/divider",desc:"Divider",example:"/divider"},{cmd:"/a",desc:"Link",example:"/a{Text|URL}"},{cmd:"/img",desc:"Image",example:"/img{URL|alt text}"},{cmd:"/callout",desc:"Callout",example:"/callout{emoji|text}"},{cmd:"/quote",desc:"Blockquote",example:"/quote{quote text}"}],Yn=he||Fe({}),Zn=Le(Yn),Jn=async t=>{if(typeof t.content=="string"){let n=t.content;n=n.replace(/\/h1\{([^}]*)\}/g,"<h1>$1</h1>"),n=n.replace(/\/h2\{([^}]*)\}/g,"<h2>$1</h2>"),n=n.replace(/\/h3\{([^}]*)\}/g,"<h3>$1</h3>"),n=n.replace(/\/b\{([^}]*)\}/g,"<strong>$1</strong>"),n=n.replace(/\/i\{([^}]*)\}/g,"<em>$1</em>"),n=n.replace(/\/u\{([^}]*)\}/g,"<u>$1</u>"),n=n.replace(/\/s\{([^}]*)\}/g,"<s>$1</s>"),n=n.replace(/\/code\{([^}]*)\}/g,"<code>$1</code>"),n=n.replace(/\/quote\{([^}]*)\}/g,"<blockquote>$1</blockquote>"),n=n.replace(/\/ul\{([^}]*)\}/g,(s,r)=>`<ul>${r.split("|").map(i=>`<li>${i.trim()}</li>`).join("")}</ul>`),n=n.replace(/\/ol\{([^}]*)\}/g,(s,r)=>`<ol>${r.split("|").map(i=>`<li>${i.trim()}</li>`).join("")}</ol>`),n=n.replace(/\/toggle\{([^|}]*)\|([^}]*)\}/g,(s,r,o)=>`<details><summary>${r.trim()}</summary><div>${o.trim()}</div></details>`),n=n.replace(/\/divider/g,"<hr>"),n=n.replace(/\/a\{([^|}]*)\|([^}]*)\}/g,(s,r,o)=>`<a href="${String(o).trim()}" target="_blank" rel="noopener noreferrer">${r.trim()}</a>`),n=n.replace(/\/img\{([^|}]*)\|([^}]*)\}/g,(s,r,o)=>`<img src="${String(r).trim()}" alt="${o.trim()}" style="max-width:100%;">`),n=n.replace(/\/callout\{([^|}]*)\|([^}]*)\}/g,(s,r,o)=>`<div style="background:#f1f5f9;padding:1em;border-radius:8px;display:flex;align-items:center;gap:0.7em;"><span style="font-size:1.3em;">${r.trim()}</span><span>${o.trim()}</span></div>`),n=n.replace(/\/pre\{([^|}]*)\|([^}]*)\}/g,(s,r,o)=>{if(r.trim().toLowerCase()==="iframe"){let i=String(o).trim();const l=i.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)$/);if(l){const[,a,d,u]=l;i=`https://raw.githubusercontent.com/${a}/${d}/${u}`}return/^https:\/\/[a-zA-Z0-9\-]+\.github\.io\/[^\s]*$/.test(i)?`<div style="margin:1em 0;"><iframe src="${i}" style="width:100%;min-height:400px;border:1px solid #eee;border-radius:6px;" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe></div>`:/^https:\/\/raw\.githubusercontent\.com\/[^\s]+$/.test(i)?`<div style="margin:1em 0;">
            <iframe srcdoc="<pre><code id='code-block'>Loading...</code><script>
              fetch('${i}')
                .then(r => r.text())
                .then(t => {
                  const el = document.getElementById('code-block');
                  el.textContent = t;
                });
            <\/script>" 
            style="width:100%;min-height:400px;border:1px solid #eee;border-radius:6px;" 
            sandbox="allow-scripts" loading="lazy"></iframe>
          </div>`:`<div style="color:red;font-size:14px;">Invalid iframe URL: ${i}</div>`}else return`<pre><code class="language-${r.trim()}">${o.trim()}</code></pre>`}),t={...t,content:n}}const e={};for(const n in t){const s=t[n];n==="auth"||n==="user"||(s===null||typeof s=="string"||typeof s=="number"||typeof s=="boolean"||typeof s=="object"&&!Array.isArray(s)&&Object.prototype.toString.call(s)==="[object Object]"||Array.isArray(s))&&(e[n]=s)}await be(ye(Zn,"devblogPosts"),e)},Qn=({onClose:t,onInsertUrl:e,onInsertUpload:n})=>c.jsx("div",{className:"img-command-popup-overlay",onClick:t,children:c.jsxs("div",{className:"img-command-popup",onClick:s=>s.stopPropagation(),children:[c.jsx("div",{style:{fontWeight:600,fontSize:18,marginBottom:8},children:"Insert Image"}),c.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10},children:[c.jsx("button",{className:"admin-panel-btn",style:{width:"100%"},onClick:e,type:"button",children:"Insert from URL"}),c.jsx("button",{className:"admin-panel-btn",style:{width:"100%"},onClick:n,type:"button",children:"Upload Image"})]}),c.jsx("button",{className:"admin-panel-btn-back",style:{position:"absolute",top:8,right:8,fontSize:18,background:"none",border:"none",color:"#888",cursor:"pointer"},onClick:t,"aria-label":"Close",type:"button",children:"×"})]})}),es=({onClose:t,onInsert:e})=>{const[n,s]=h.useState(""),[r,o]=h.useState(""),[i,l]=h.useState(""),a=h.useRef(null);h.useEffect(()=>{setTimeout(()=>{a.current&&a.current.focus()},0)},[]);const d=u=>{if(u.preventDefault(),!n.trim()){l("Please enter an image URL.");return}e(String(n).trim(),r.trim())};return c.jsx("div",{className:"img-command-popup-overlay",onClick:t,children:c.jsxs("div",{className:"img-command-popup",onClick:u=>u.stopPropagation(),role:"form",tabIndex:-1,children:[c.jsx("div",{style:{fontWeight:600,fontSize:18,marginBottom:8},children:"Insert Image from URL"}),c.jsx("input",{ref:a,type:"text",placeholder:"Image URL",value:n,onChange:u=>s(u.target.value)}),c.jsx("input",{type:"text",placeholder:"Alt text (optional)",value:r,onChange:u=>o(u.target.value)}),i&&c.jsx("div",{style:{color:"red",fontSize:13},children:i}),c.jsxs("div",{style:{display:"flex",gap:10},children:[c.jsx("button",{className:"admin-panel-btn",type:"button",style:{flex:1},onClick:d,children:"Insert"}),c.jsx("button",{className:"admin-panel-btn-back",type:"button",style:{flex:1},onClick:t,children:"Cancel"})]})]})})},ts=({onClose:t,onInsert:e,firebaseApp:n})=>{const[s,r]=h.useState(null),[o,i]=h.useState(""),[l,a]=h.useState(!1),[d,u]=h.useState(0),[m,p]=h.useState(""),w=h.useRef(null);h.useEffect(()=>{setTimeout(()=>{w.current&&w.current.focus()},0)},[n]);const b=async y=>{if(y&&y.preventDefault(),p(""),u(0),!s){p("Please select an image file.");return}a(!0);try{const A=je(n).currentUser;if(!A){p("You must be logged in to upload images."),a(!1);return}if(!s.type.startsWith("image/")){p("Only image files are allowed."),a(!1);return}const E=lt(n),f=`devblog_images/${Date.now()}_${s.name}`,x=at(E,f),N={contentType:s.type,customMetadata:{uploadedBy:A.uid}},I=Wn(x,s,N);I.on("state_changed",T=>{const L=Math.round(T.bytesTransferred/T.totalBytes*100);u(L)},T=>{T.code==="storage/unauthorized"||T.message&&T.message.includes("User does not have permission")?p("You do not have permission to upload images. Please make sure you are logged in."):T.code==="storage/canceled"?p("Upload canceled."):T.code==="storage/unknown"?p("Unknown error occurred during upload."):p("Failed to upload image."),a(!1),u(0),console.error(T)},async()=>{try{const T=await it(I.snapshot.ref);e(String(T),o.trim()||s.name)}catch(T){p("Failed to get image URL."),console.error(T)}finally{a(!1),u(0)}})}catch(g){p("Failed to upload image."),a(!1),u(0),console.error(g)}};return c.jsx("div",{className:"img-command-popup-overlay",onClick:t,children:c.jsxs("div",{className:"img-command-popup",onClick:y=>y.stopPropagation(),role:"form",tabIndex:-1,children:[c.jsx("div",{style:{fontWeight:600,fontSize:18,marginBottom:8},children:"Upload Image"}),c.jsx("input",{ref:w,type:"file",accept:"image/*",onChange:y=>r(y.target.files[0]),disabled:l}),c.jsx("input",{type:"text",placeholder:"Alt text (optional)",value:o,onChange:y=>i(y.target.value),disabled:l}),d>0&&l&&c.jsxs("div",{className:"progress-bar",children:[c.jsx("div",{className:"progress-bar-inner",style:{width:`${d}%`}}),c.jsxs("div",{style:{fontSize:12,color:"#888",marginTop:2},children:[d,"%"]})]}),m&&c.jsx("div",{className:"admin-panel-error-inline",children:m}),c.jsxs("div",{style:{display:"flex",gap:10},children:[c.jsx("button",{className:"admin-panel-btn",type:"button",style:{flex:1},disabled:l,onClick:b,children:l?"Uploading...":"Upload & Insert"}),c.jsx("button",{className:"admin-panel-btn-back",type:"button",style:{flex:1},onClick:t,disabled:l,children:"Cancel"})]})]})})},ns=({value:t,onChange:e,disabled:n,id:s,...r})=>{const[o,i]=h.useState(!1),[l,a]=h.useState([]),[d,u]=h.useState(0),m=h.useRef(null),p=h.useRef(null),[w,b]=h.useState(!1),[y,g]=h.useState(!1),[A,E]=h.useState(!1),f=(_,k)=>{const S=_.slice(0,k),U=S.match(/\/[a-zA-Z0-9]*$/);return U?{word:U[0],start:S.length-U[0].length,end:S.length}:null},x=_=>{const k=_.target.value,S=_.target.selectionStart,U=f(k,S);if(U){const B=Kn.filter(M=>M.cmd.startsWith(U.word));a(B),i(B.length>0),u(0)}else i(!1),a([]);e(_)},N=_=>{o&&l.length>0&&(_.key==="ArrowDown"?(_.preventDefault(),u(k=>(k+1)%l.length)):_.key==="ArrowUp"?(_.preventDefault(),u(k=>(k-1+l.length)%l.length)):_.key==="Tab"||_.key==="Enter"?(_.preventDefault(),I(d)):_.key==="Escape"&&i(!1))},I=_=>{if(!o||l.length===0)return;const k=l[_],S=m.current;if(!S)return;const U=S.value,B=S.selectionStart,M=f(U,B);if(M){if(k.cmd==="/img"){i(!1),b(!0);return}const P=U.slice(0,M.start),V=U.slice(B),X=k.example,ne=P+X+V;e({target:{value:ne}}),setTimeout(()=>{const z=P.length+X.length;S.setSelectionRange(z,z),S.focus()},0),i(!1)}};h.useEffect(()=>{const _=k=>{p.current&&!p.current.contains(k.target)&&m.current&&!m.current.contains(k.target)&&i(!1)};return o&&document.addEventListener("mousedown",_),()=>{document.removeEventListener("mousedown",_)}},[o]);const T=_=>{I(_)},L=(_,k)=>{const S=m.current;if(!S)return;const U=S.value,B=S.selectionStart,M=f(U,B);let P,V;M&&U.slice(M.start,B)==="/img"?(P=U.slice(0,M.start),V=U.slice(B)):(P=U.slice(0,B),V=U.slice(B));const X=`/img{${String(_)}|${k}}`,ne=P+X+V;e({target:{value:ne}}),setTimeout(()=>{const z=P.length+X.length;S.setSelectionRange(z,z),S.focus()},0),b(!1),g(!1),E(!1)},$=()=>{b(!1),g(!1),E(!1)},G=()=>{b(!1),g(!0)},te=()=>{b(!1),E(!0)};return c.jsxs("div",{style:{position:"relative"},children:[c.jsx("textarea",{ref:m,id:s,value:t,onChange:x,onKeyDown:N,disabled:n,autoComplete:"off",spellCheck:!1,...r}),o&&l.length>0&&c.jsx("div",{ref:p,className:"slash-autocomplete-dropdown",children:l.map((_,k)=>c.jsxs("div",{className:`slash-autocomplete-option${k===d?" selected":""}`,onMouseDown:S=>{S.preventDefault(),T(k)},children:[c.jsx("span",{style:{fontWeight:500},children:_.cmd}),c.jsx("span",{style:{color:"#666",fontSize:12},children:_.desc}),c.jsx("span",{style:{color:"#aaa",fontSize:11},children:_.example})]},_.cmd))}),w&&c.jsx(Qn,{onClose:$,onInsertUrl:G,onInsertUpload:te}),y&&c.jsx(es,{onClose:$,onInsert:L}),A&&c.jsx(ts,{onClose:$,onInsert:L,firebaseApp:he})]})},ct=he||Fe({}),De=Le(ct),as=()=>{const[t,e]=h.useState(!1),[n,s]=h.useState(""),[r,o]=h.useState(!1),[i,l]=h.useState(""),[a,d]=h.useState(!1),[u,m]=h.useState(!1),[p,w]=h.useState(null),[b,y]=h.useState(""),[g,A]=h.useState(!1),[E,f]=h.useState(""),[x,N]=h.useState(""),[I,T]=h.useState(""),[L,$]=h.useState(""),[G,te]=h.useState(!1),[_,k]=h.useState(""),[S,U]=h.useState(""),[B,M]=h.useState(!1),[P,V]=h.useState(null),[X,ne]=h.useState(null),z=Rt();h.useEffect(()=>{const C=je(ct);ne(C);const O=xt(C,le=>{le?V(le):z("/login",{replace:!0}),M(!0)});return()=>O()},[z]);const ut=()=>{m(!0),w(null),y(""),f(""),N("")},dt=()=>{m(!1),w(null),y(""),f(""),N("")},ht=C=>{w(C.target.files[0]),f(""),N("")},pt=async C=>{if(C.preventDefault(),f(""),N(""),!p){f("Please select a file to upload.");return}if(!b.trim()){f("Please enter the artist name.");return}A(!0);try{if(!P){f("You must be logged in to upload art."),A(!1);return}const O=await P.getIdToken(),le=lt(he),wt=`artworks/${Date.now()}_${p.name}`,Ue=at(le,wt);try{await Hn(Ue,p)}catch(K){if(K.code==="storage/unauthorized"||K.message&&K.message.includes("User does not have permission")){f("You do not have permission to upload art. Please make sure you are logged in with an account that has upload access. If the problem persists, contact an admin to check your Firebase Storage security rules."),A(!1);return}else{if(K.message&&(K.message.toLowerCase().includes("permission")||K.message.toLowerCase().includes("unauthorized"))){f("You do not have permission to upload art. Please make sure you are logged in with an account that has upload access. If the problem persists, contact an admin to check your Firebase Storage security rules."),A(!1);return}throw K}}const kt=await it(Ue);await be(ye(De,"artworks"),{artist:b.trim(),url:kt,fileName:p.name,createdAt:fe(),uploaderUid:P.uid}),N("Art uploaded successfully!"),w(null),y("")}catch(O){O&&O.message&&(O.message.toLowerCase().includes("permission")||O.message.toLowerCase().includes("unauthorized"))?f("You do not have permission to upload art. Please make sure you are logged in with an account that has upload access. If the problem persists, contact an admin to check your Firebase Storage security rules."):f(O&&O.message?`Failed to upload art: ${O.message}`:"Failed to upload art."),console.error(O)}finally{A(!1)}},ft=()=>{d(!0),T(""),$(""),k(""),U("")},mt=()=>{d(!1),T(""),$(""),k(""),U("")},gt=async C=>{if(C.preventDefault(),k(""),U(""),!I.trim()||!L.trim()){k("Title and content are required.");return}te(!0);try{if(!P){k("You must be logged in to post."),te(!1);return}await Jn({title:I.trim(),content:L.trim(),createdAt:fe(),auth:X,user:P}),U("Dev blog post created!"),T(""),$("")}catch(O){k("Failed to create dev blog post."),console.error(O)}finally{te(!1)}},_t=async()=>{o(!0),l("");const C=Math.random().toString(36).slice(2,10).toUpperCase();try{if(!P){l("You must be logged in to add a user."),o(!1);return}await be(ye(De,"inviteCodes"),{code:C,createdAt:fe(),used:!1,createdBy:P.uid}),s(C),e(!0)}catch(O){l("Failed to add invite code to Firestore."),console.error(O)}finally{o(!1)}},bt=()=>{e(!1),s(""),l("")},yt=()=>{z("/rosa-approve")};return B?P?c.jsxs("div",{className:"admin-panel-container",children:[c.jsx("h2",{className:"admin-panel-title",children:"Admin Panel"}),i&&c.jsx("div",{className:"admin-panel-error",children:i}),u?c.jsxs("form",{onSubmit:pt,className:"admin-panel-form",children:[c.jsx("label",{htmlFor:"art-file",children:"Upload Art File"}),c.jsx("input",{id:"art-file",type:"file",accept:"image/*",onChange:ht,disabled:g}),c.jsx("label",{htmlFor:"artist-name",children:"Artist Name"}),c.jsx("input",{id:"artist-name",type:"text",value:b,onChange:C=>y(C.target.value),disabled:g}),E&&c.jsx("div",{className:"admin-panel-error-inline",children:E}),x&&c.jsx("div",{className:"admin-panel-success",children:x}),c.jsxs("div",{className:"admin-panel-btn-row",children:[c.jsx("button",{type:"button",onClick:dt,className:"admin-panel-btn-back",disabled:g,children:"Back"}),c.jsx("button",{type:"submit",className:"admin-panel-btn",disabled:g,children:g?"Uploading...":"Submit"})]})]}):a?c.jsxs("form",{onSubmit:gt,className:"admin-panel-form devpost-form",children:[c.jsx("label",{htmlFor:"devpost-title",children:"Title"}),c.jsx("input",{id:"devpost-title",type:"text",value:I,onChange:C=>T(C.target.value),autoFocus:!0,disabled:G}),c.jsx("label",{htmlFor:"devpost-content",children:"Content"}),c.jsx(ns,{id:"devpost-content",value:L,onChange:C=>$(C.target.value),disabled:G,style:{minHeight:120,width:"100%",resize:"vertical"}}),_&&c.jsx("div",{className:"admin-panel-error-inline",children:_}),S&&c.jsx("div",{className:"admin-panel-success",children:S}),c.jsxs("div",{className:"admin-panel-btn-row",children:[c.jsx("button",{type:"button",onClick:mt,className:"admin-panel-btn-back",disabled:G,children:"Back"}),c.jsx("button",{type:"submit",className:"admin-panel-btn",disabled:G,children:G?"Posting...":"Post"})]})]}):t?c.jsxs("div",{className:"admin-panel-flex-col-center",children:[c.jsx("div",{className:"admin-panel-invite-code",children:n}),c.jsx("button",{onClick:bt,className:"admin-panel-btn-back",children:"Back"})]}):c.jsxs("div",{className:"admin-panel-flex-col-center",children:[c.jsx("button",{onClick:ut,className:"admin-panel-btn",children:"Add Art"}),c.jsx("button",{onClick:ft,className:"admin-panel-btn",children:"Make Dev Post"}),c.jsx("button",{onClick:_t,disabled:r,className:"admin-panel-btn",children:r?"Generating...":"Add User"}),c.jsx("button",{onClick:yt,className:"admin-panel-btn",type:"button",children:"Rosa Approve"})]})]}):null:c.jsx("div",{className:"admin-panel-container",children:c.jsx("div",{children:"Loading..."})})};export{as as default};
