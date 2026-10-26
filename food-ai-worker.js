import {pipeline,env} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';
env.allowLocalModels=false;
env.backends.onnx.wasm.numThreads=1;
env.backends.onnx.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/';
let classifier=null,busy=false;
self.onmessage=async({data})=>{if(busy)return;busy=true;const {id,image}=data;try{
 if(typeof image!=='string'||image.length>80000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(image))throw Error('写真データを確認できません');
 if(!classifier)classifier=await pipeline('image-classification','onnx-community/swin-finetuned-food101-ONNX',{revision:'e5e50bfc6425aa546f3b4421ca8bd79d0dd610b8',device:'wasm',dtype:'q8',progress_callback:p=>{if(p.status==='progress')self.postMessage({id,type:'progress',text:'AI準備中 '+(p.file||'')+' '+Math.round(p.progress||0)+'%'});}});
 self.postMessage({id,type:'progress',text:'写真を端末内で解析しています…'});
 const result=await classifier(image,{top_k:3});self.postMessage({id,type:'result',result});
 }catch(e){self.postMessage({id,type:'error',text:String(e.message||e)});classifier=null;}finally{busy=false;}};
