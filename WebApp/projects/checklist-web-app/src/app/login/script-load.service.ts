import { Injectable } from '@angular/core'

interface Script {
  name:string,
  src:string
}
export const ScriptStore: Script[] = [
  {name:'google-sign-in',src:'https://accounts.google.com/gsi/client'}
];

export class ScriptService {

  private scripts: any = {};
  
  constructor() {
     ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  loadScript(name : string){
    return new Promise((resolve,reject)=>{
      if (this.scripts[name].loaded){
        resolve({script:name,loaded:true,status:'Already Loaded'})
      }
      else{
        const script = document.createElement('script');
        script.type = 'text/javascript'
        script.src = this.scripts[name].src;
        script.defer = true
        script.onload = () => {
          
          this.scripts[name].loaded=true;
          console.log(`${name} loaded`)
          resolve({script:name,loaded:true,status:'Loaded'})

        }

        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    })
  }

  load(...scripts:string[]){
    const promises:any[] = []

    scripts.forEach((script)=>{
      promises.push(this.loadScript(script));
    })
    return Promise.all(scripts);

  }
}

