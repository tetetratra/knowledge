let worker, nextId=0;
const pending = new Map();
export function searchSemantic(term, version) {
  if (!worker) {
    worker = new Worker(new URL('./semantic-worker.js'+version,import.meta.url),{type:'module'});
    worker.onmessage = ({data}) => {
      const request = pending.get(data.id);
      if (!request) return;
      clearTimeout(request.timer);pending.delete(data.id);
      if (data.error) request.reject(new Error('意味検索を利用できません')); else request.resolve(data.results);
    };
    worker.onerror = () => {
      for (const request of pending.values()) {clearTimeout(request.timer);request.reject(new Error('意味検索を利用できません'));}
      pending.clear();worker.terminate();worker=undefined;
    };
  }
  return new Promise((resolve,reject)=>{
    const id=++nextId;
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error('意味検索がタイムアウトしました'));},120000);
    pending.set(id,{resolve,reject,timer});
    worker.postMessage({id,term});
  });
}
