import { Tokenizer } from '@huggingface/tokenizers';
import { embedTokens, semanticMatches } from './embedding.js';

let model;
async function loadModel() {
  const root = new URL('semantic/', import.meta.url);
  const load = async (file, json = false) => {
    const response = await fetch(new URL(file,root), {cache:file === 'manifest.json' ? 'no-cache' : 'default'});
    if (!response.ok) throw new Error('意味検索のデータを取得できません');
    return json ? response.json() : response.arrayBuffer();
  };
  const config = await load('manifest.json',true);
  const [tokenizer,weights,vectors,ids] = await Promise.all([
    load(config.tokenizer,true),load(config.weights),load(config.vectors),load(config.ids,true),
  ]);
  if (weights.byteLength !== config.vocabulary * (4+config.dimensions) || vectors.byteLength !== ids.length*config.dimensions*4) throw new Error('意味検索のデータ形式が不正です');
  return {...config, tokenizer:new Tokenizer(tokenizer,{}),
    weights:new Int8Array(weights,config.vocabulary*4),scales:new Float32Array(weights,0,config.vocabulary),
    vectors:new Float32Array(vectors),ids};
}
self.onmessage = async ({data:{id,term}}) => {
  try {
    model ||= loadModel().catch(error=>{model=undefined;throw error;});
    const data = await model;
    const ids = data.tokenizer.encode(term.slice(0,512),{add_special_tokens:false}).ids;
    const query = embedTokens(ids,data.weights,data.scales,data.dimensions);
    self.postMessage({id,results:semanticMatches(query,data.vectors,data.ids,data.dimensions)});
  } catch { self.postMessage({id,error:true}); }
};
