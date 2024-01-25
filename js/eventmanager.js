class EventManager {

    static instance = null;

    constructor() {
        if (EventManager.instance) return;

        EventManager.instance = this;
        this.events = {};
    }

    static init() {
        if (!EventManager.instance) 
            EventManager.instance = new EventManager();

        return EventManager.instance;        
    }

    make(eventName, emitFunction = () => {}, repeat = false) {
        this.events[eventName] = new Event(eventName, emitFunction, repeat);
    }

    emit(event = '') {
        if (!this.events[event]) return;
        if (!this.events[event].isRepeating && this.events[event].triggered) return; 

        const currentEvent = this.events[event];

        if (currentEvent.isRepeating) {
            currentEvent.resetTrigger();
        }

        if (!currentEvent.triggered) {
            currentEvent.activateTrigger();
            currentEvent.onStart();
            currentEvent.onEmit();
        }
    }

    on(event, callBack = () => {}) {
        if (!this.events[event]) return;

        this.events[event].onStart = callBack;
    }

    off(event, callBack = () => {}) {
        if (!this.events[event]) return;

        this.events[event].onEnd = callBack;
    }

    add(event) {
        this.events[event.name] = event;
    }

    remove(event) {
        if (!this.events[event]) return;

        this.events[event].onEnd();
        delete this.events[event];
    }
}


class Event {
    constructor(name, emitCallBack = () => {}, repeatCallback = false) {
        this.name = name;
        this.isRepeating = repeatCallback;
        this.triggered = false; 
        this.onStart = () => {};
        this.onEmit = emitCallBack;
        this.onEnd = () => {};
    }

    activateTrigger() {
        this.triggered = true;
    }

    resetTrigger(){
        this.triggered = false;
    }
}
