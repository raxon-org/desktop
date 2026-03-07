import { getSection } from "/Module/Section.js";
import create from "/Module/Create.js";
import { replace } from "/Module/String.js";
import { dialog } from "/Dialog/Module/Dialog.js";
import { task } from "/Application/Desktop/Module/Task.js";
// import { pipeline, cos_sim } from "/Xenova/transformers.js";
//import user from "/Module/User.js";

let taskbar = {};

taskbar.init = async (init) => {
    const id = init.id;
    const sse = init.sse;
    let sse_id;
    /*
    const section = getSection(id);
    if(!section){
        return;
    }
     */

// Create a feature extraction pipeline
    /*
    const extractor = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1', {
        quantized: false, // Comment out this line to use the quantized version
    });

// Generate sentence embeddings
    const docs = [
        'Represent this sentence for searching relevant passages: A man is eating a piece of bread',
        'A man is eating food.',
        'A man is eating pasta.',
        'The girl is carrying a baby.',
        'A man is riding a horse.',
    ]
    const output = await extractor(docs, {pooling: 'cls'});

// Compute similarity scores
    const [source_embeddings, ...document_embeddings] = output.tolist();
    const similarities = document_embeddings.map(x => cos_sim(source_embeddings, x));
    console.log(similarities);

     */
/*
    let eventSource = new EventSource(sse.url, {
        withCredentials: true,
    });
 */
    /*
    eventSource.onmessage = (event) => {
        console.log(event);
        let data = JSON.parse(event.data);
        console.log(data);
        if(data.type === 'add'){
            taskbar.add(data.namespace, data.id);
        } else if(data.type === 'update'){
            taskbar.update(data.id);
        } else if(data.type === 'delete'){
            taskbar.delete(data.id);
        }
    }
     */

    /*
    eventSource.addEventListener('waiting-for-response', (event) => {
        try {
            let data = pako.inflate(atob(event.data), {raw: true, to: 'string'});
            sse_id = event.lastEventId;
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    });

    eventSource.addEventListener('ping', (event) => {
        console.log(event);
    });


    eventSource.addEventListener('open', (event) => {
// Connection was opened.
        console.log('connection opened');
        console.log(sse_id);
    });

    eventSource.addEventListener('error', (event) => {
        console.log(event);
        if (event.readyState == EventSource.CLOSED) {
            console.log('connection closed');
            console.log(sse_id);
        }
    });
     */
    console.log(init);
    // let key = user.get('key');
    // console.log(key);
}


taskbar.add = (namespace, id) => {
    const section = getSection(id);
    if(!section){
        return;
    }
    const navigation = select('section[name="application-desktop-navigation"]');
    const head = section.select('.head');
    if(
        navigation &&
        head
    ){
        head.on('mousedown', (event) => {
            let div = navigation.select('div[data-section-id="' + id + '"]');
            if(div){
                div.click(event);
            }
        });
        const icon = head.select('.icon');
        const task_bar = navigation.select('.task-bar');
        if(
            icon &&
            task_bar
        ){
            if(icon.tagName.toLowerCase() === 'i') {
                let i = create('i', icon.getClass());
                let div = create('div', 'thumbnail thumbnail-' + replace('.', '-', namespace));
                div.appendChild(i);
                div.title = head.data('title');
                div.data('namespace', namespace);
                div.data('section-id', id);
                div.on('click', (event) => {
                    const section = getSection(div.data('section-id'));
                    if (section) {
                        section.removeClass('display-none');
                        dialog.index(section);
                        taskbar.active(div.data('section-id'));
                        task.active({
                            namespace: namespace,
                            id: id,
                        });
                        //file.section_active(div.data('section-id'));
                    } else {
                        div.remove();
                    }
                });
                task_bar.appendChild(div);
            } else if (icon.tagName.toLowerCase() === 'img'){
                let img = icon.cloneNode(true);
                let div = create('div', 'thumbnail thumbnail-' + replace('.', '-', namespace));
                div.appendChild(img);
                div.title = head.data('title');
                div.data('namespace', namespace);
                div.data('section-id', id);
                div.on('click', (event) => {
                    const section = getSection(div.data('section-id'));
                    if (section) {
                        section.removeClass('display-none');
                        dialog.index(section);
                        taskbar.active(div.data('section-id'));
                        task.active({
                            namespace: namespace,
                            id: id,
                        });
                        // file.section_active(div.data('section-id'));
                    } else {
                        div.remove();
                    }
                });
                task_bar.appendChild(div);
            } else {
                console.warn('Navigation/Module/Js/Taskbar.js icon not implemented in add...');
            }
        }
    }
}

taskbar.update = (id) => {
    const navigation = select('section[name="application-desktop-navigation"]');
    if(!navigation){
        return;
    }
    const task_bar = navigation.select('.task-bar');
    if(!task_bar) {
        return;
    }
    const div = task_bar.select('div[data-section-id="' + id + '"]');
    if(!div){
        return;
    }
    const section = getSection(id);
    if(!section){
        return;
    }
    const head = section.select('.head');
    if(!head){
        return;
    }
    div.title = head.data('title');
}

taskbar.delete = (id) => {
    const navigation = select('section[name="application-desktop-navigation"]');
    if(!navigation) {
        return;
    }
    const task_bar = navigation.select('.task-bar');
    if(!task_bar) {
        return;
    }
    const div = task_bar.select('div[data-section-id="' + id + '"]');
    if(!div) {
        return;
    }
    div.remove();
}

taskbar.active = (id) => {
    const navigation = select('section[name="application-desktop-navigation"]');
    if (!navigation) {
        return;
    }
    const task_bar = navigation.select('.task-bar');
    if (!task_bar) {
        return;
    }
    let thumbnails = task_bar.select('div.thumbnail');
    if (is.nodeList(thumbnails)) {
        thumbnails.forEach((thumbnail) => {
            thumbnail.removeClass('active');
        });
    } else if (thumbnails) {
        thumbnails.removeClass('active');
    }
    const div = task_bar.select('div[data-section-id="' + id + '"]');
    if (!div) {
        return;
    }
    div.addClass('active');
}

export { taskbar };




