import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Tokenizer } from '@huggingface/tokenizers';
import { build } from 'esbuild';
import { embedTokens } from '../site/embedding.js';

export const modelId = 'hotchpotch/static-embedding-japanese';
export const revision = '95b3d9c80a7ccf604e2b5daee7b1b3eed6b1a9d3';
export const dimensions = 128;
const cache = 'work/embedding-model';
async function download(name) {
  await mkdir(cache, {recursive:true});
  const path = `${cache}/${name.split('/').at(-1)}`;
  try { return await readFile(path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const response = await fetch(`https://huggingface.co/${modelId}/resolve/${revision}/${name}`, {signal:AbortSignal.timeout(180000)});
  if (!response.ok) throw new Error(`モデル取得失敗: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path, buffer);
  return buffer;
}
export async function prepareModel() {
  const [raw, tokenizerRaw] = await Promise.all([download('0_StaticEmbedding/model.safetensors'), download('0_StaticEmbedding/tokenizer.json')]);
  if (createHash('sha256').update(raw).digest('hex') !== 'f0c60b3d2952fb89e67a063ac4aa558ff4b02facaac5fd674d637b9e2c52ccca' || createHash('sha256').update(tokenizerRaw).digest('hex') !== '833add01c9eb44e78ffb2d9195caace320de0fcf64d1f4d95bc541b6e30a9fc9') throw new Error('モデルのチェックサムが一致しません');
  const headerLength = Number(raw.readBigUInt64LE(0));
  const info = JSON.parse(raw.subarray(8,8+headerLength))['embedding.weight'];
  if (info.dtype !== 'F32' || info.shape[0] !== 32768 || info.shape[1] !== 1024) throw new Error('想定外のモデル形式');
  const [vocabulary, originalDimensions] = info.shape;
  const floats = new DataView(raw.buffer, raw.byteOffset+8+headerLength+info.data_offsets[0]);
  const scales = new Float32Array(vocabulary), weights = new Int8Array(vocabulary*dimensions);
  for (let row=0; row<vocabulary; row++) {
    let max=0;
    for (let d=0; d<dimensions; d++) max=Math.max(max,Math.abs(floats.getFloat32((row*originalDimensions+d)*4,true)));
    scales[row]=max/127 || 1;
    for (let d=0; d<dimensions; d++) weights[row*dimensions+d]=Math.round(floats.getFloat32((row*originalDimensions+d)*4,true)/scales[row]);
  }
  const config=JSON.parse(tokenizerRaw);
  // Tokenizers.js未対応のNmtを、同じ文字変換を行うReplaceで表す。
  // https://github.com/huggingface/tokenizers/blob/v0.21.4/tokenizers/src/normalizers/unicode.rs
  config.normalizer.normalizers.splice(0,1,
    {type:'Replace',pattern:{Regex:'[\\u0001-\\u0008\\u000B\\u000E-\\u001F\\u007F\\u008F\\u009F]'},content:''},
    {type:'Replace',pattern:{Regex:'[\\u0009\\u000A\\u000C\\u000D\\u1680\\u200B-\\u200F\\u2028\\u2029\\u2581\\uFEFF\\uFFFD]'},content:' '});
  const tokenizer = new Tokenizer(config, {});
  const encode = text => embedTokens(tokenizer.encode(text,{add_special_tokens:false}).ids,weights,scales,dimensions);
  return {encode, config, weights, scales, vocabulary};
}

export async function buildSemantic(pages) {
  const model=await prepareModel();
  await mkdir('dist/semantic',{recursive:true});
  const save = async (name,buffer) => {
    const hash=createHash('sha256').update(buffer).digest('hex').slice(0,16);
    const file=name.replace('.',`.${hash}.`);
    await writeFile('dist/semantic/'+file,buffer);
    return file;
  };
  const weights=Buffer.concat([Buffer.from(model.scales.buffer),Buffer.from(model.weights.buffer)]);
  const ids=[], vectors=[];
  for (const page of pages) {
    const title=`${page.title} ${page.tags.join(' ')}`;
    const prose=page.searchText.replace(/https?:\/\/\S+/g,'');
    const chunks=[title];
    for (let i=0;i<prose.length;i+=500) chunks.push(`${title} ${prose.slice(i,i+600)}`);
    for (const chunk of chunks) { ids.push(page.id); vectors.push(...model.encode(chunk)); }
  }
  const manifest={modelId,revision,dimensions,vocabulary:model.vocabulary,
    weights:await save('weights.bin',weights),
    tokenizer:await save('tokenizer.json',Buffer.from(JSON.stringify(model.config))),
    vectors:await save('vectors.bin',Buffer.from(new Float32Array(vectors).buffer)),
    ids:await save('ids.json',Buffer.from(JSON.stringify(ids)))};
  await writeFile('dist/semantic/manifest.json',JSON.stringify(manifest));
  await build({entryPoints:['site/semantic-worker.js'],outfile:'dist/semantic-worker.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
  await writeFile('dist/semantic/LICENSE.txt', await readFile('scripts/embedding-LICENSE.txt'));
  return {modelBytes:weights.length+Buffer.byteLength(JSON.stringify(model.config)),chunks:ids.length};
}
