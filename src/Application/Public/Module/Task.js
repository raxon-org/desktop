import { object } from "/Module/Object.js";
import user from "/Module/User.js";


let task = {};

task.data = {
    data : {},
    set : (attribute, value) => {
        if(typeof attribute === 'object'){
            for(let attr in attribute){
                object.set(attr, attribute[attr], task.data.data);
            }
        } else {
            object.set(attribute, value, task.data.data);
        }
    },
    has : (attribute) => {
        return object.has(attribute, task.data.data);
    },
    get : (attribute) => {
        return object.get(attribute, task.data.data);
    },
    delete : (attribute) => {
        return object.delete(attribute, task.data.data);
    }
};

task.active = (options, closure) => {
    if(!options?.id){
        return false;
    }
    if(!options?.namespace){
        return false;
    }
    let active = task.data.get('active') ?? [];
    let list = task.data.get('list') ?? [];
    let index;
    let is_registered = false;
    for(index=0; index < active.length; index++){
        let node = active[index];
        if(node === options.id){
            is_registered = true;
            break;
        }
    }
    if(
        is_registered === false &&
        options.id
    ){
        let length = active.push(options.id);
        index = length - 1;
    }
    let application = {
        id : options.id,
        namespace: options.namespace,
        index: index,
        is_active: true,
        config: options.config ?? {}
    };
    let i;
    for(i=0; i < list.length; i++){
        let node = list[i];
        node.is_active = false;
    }
    list[index] = application;
    task.data.set('active', active);
    task.data.set('list', list);
    console.log(active);
    console.log(list);

    console.log(options);

    /*
    eventSource.addEventListener('waiting-for-response', (event) => {
        try {
            let data = pako.inflate(atob(event.data),{ raw: true, to: 'string' });
            sse_id = event.lastEventId;
            console.log(data);
        } catch(error){
            console.error(error);
        }
    });
     */
    let config = false;
    if(options?.config?.url){
        let url = options?.config?.url;
        /*
        url += '?filter[user][strictly-exact]=' + user.get('uuid');
        url += '&sort[user]=ASC&sort[name]=ASC';
        url += '&limit=1';
         */
        const token = user.token();
        header("Authorization", 'Bearer ' + token);
        request(url, null, (url, response) => {
            if(response?.user){
                config = response;
            }
            if(closure){
                closure(config);
            }
        });
    } else if(closure){
        closure(config);
    }
}

export { task };