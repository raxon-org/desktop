import { taskbar } from "/Application/Desktop/Module/Taskbar.js";
import { getSectionById, getSectionByName } from "/Module/Section.js";
//import { dialog } from "/Dialog/Module/Dialog.js";
import user from "/Module/User.js";

let navigation = {};

navigation.init = (id) => {
    console.log(id);
    let section = getSectionById(id);
    if(!section){
        console.warn('Cannot find section with id: ' + id);
        return
    }
    section.removeClass('display-none');
    let nav = section.select('section[name="application-desktop-navigation"]');
    nav.removeClass('display-none');
    navigation.start(nav);
    navigation.menu(nav);
    navigation.clock(nav);
    _('navigation').collection(
        'clock.interval.id',
        setInterval(() => { navigation.clock(nav); },1000)
    );
    //taskbar.init();
}

navigation.start = (section) => {
    let start = section.select('img.start');
    if(!start){
        return;
    }
    start.on('click', (event) => {
        const menu = section.select('nav.menu');
        if(!menu){
            return;
        }
        let node;
        let node_zIndex;
        let index;
        let zIndex = 1;
        let select_dialog = select('body section .dialog');
        if(select_dialog){
            if(is.nodeList(select_dialog)){
                for(index=0; index < select_dialog.length; index++){
                    node = select_dialog[index];
                    node_zIndex = parseInt(node.css('z-index'));
                    if(node_zIndex > zIndex){
                        zIndex = node_zIndex;
                    }
                }
            } else {
                node = select_dialog;
                node_zIndex = parseInt(node.css('z-index'));
                if(node_zIndex > zIndex){
                    zIndex = node_zIndex;
                }
            }
        }
        menu.css('zIndex', ++zIndex);
        menu.toggleClass('display-none');
    });
}

navigation.menu = (section) => {
    const list = section.select('nav.menu a');
    console.log(list);
    if(!list){
        return;
    }
    let index;
    if(is.nodeList(list)){
        for(index=0; index < list.length; index++){
            let node = list[index];
            node.on('click', (event) => {
                let method = node.attribute('data-method');
                let target = node.attribute('data-target');
                let url = node.attribute('data-url');
                let authorization = node.attribute('data-header-with-authorization');
                if(authorization){
                    header('Authorization', 'Bearer ' + user.token());
                }
                request(url, {
                    method : method,
                    target : target
                }, (url, response) => {
                    const menu = section.select('nav.menu');
                    if(!menu){
                        return;
                    }
                    menu.toggleClass('display-none');
                    console.log(response);
                });
            });
        }
    } else {
        let node = list;
        node.on('click', (event) => {
            let method = node.attribute('data-method');
            let target = node.attribute('data-target');
            let url = node.attribute('data-url');
            request(url, {
                method : method,
                target : target
            }, (url, response) => {
                const menu = section.select('nav.menu');
                if(!menu){
                    return;
                }
                menu.toggleClass('display-none');
            });
        });
    }
}

navigation.active = () => {
    let start = select('section[name="application-desktop-navigation"] img.start');
    if(start){
        start.click();
    }
}

navigation.close = () => {
    const menu = select('nav.menu');
    if(!menu){
        return;
    }
    if(!menu.hasClass('display-none')){
        menu.toggleClass('display-none');
    }
}

navigation.get = {};


navigation.get.day = (date) => {
    let day_of_the_week = date.getDay();
    switch(day_of_the_week){
        case 0 :
            return 'Sunday';
        case 1 :
            return 'Monday';
        case 2 :
            return 'Tuesday';
        case 3 :
            return 'Wednesday';
        case 4 :
            return 'Thursday';
        case 5 :
            return 'Friday';
        case 6 :
            return 'Saturday';
    }
}

navigation.clock = (section) => {
    let clock = section.select('.clock');
    if(!clock){
        console.warn('Cannot find clock...');
        return;
    }
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    minute = ( minute < 10 ? '0' : '' ) + minute;
    day = ( day < 10 ? '0' : '' ) + day;
    month = ( month < 10 ? '0' : '' ) + month;
    let day_of_the_week = navigation.get.day(date);
    const time= clock.select('.time');
    time.html(day_of_the_week + '<br>' + hour + ':' + minute);
    const week = clock.select('.week');
    week.html('Week: ' + _('navigation').week(date));
    const node = clock.select('.date');
    node.html(year + '-' + month + '-' + day);
}

export { navigation }
