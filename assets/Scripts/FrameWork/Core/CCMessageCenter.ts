 export default class CCMessageCenter {
    static m_senders: any=[];
    static validSender(sender) {
        return sender && sender.listeners;
    }
    static register(sender, receiver, handler) {
        let ls = this.validSender(sender);
        if (!ls)
            return;
        let h = typeof handler === 'string' ? receiver[handler] : handler;
        if (!h || typeof h !== 'function') {
            console.warn("MessageCenter: receiver %s has invalid handler %s", receiver, handler);
            return;
        }
        for (let i = 0; i < ls.length; ++i) {
            let l = ls[i];
            if (l && l.receiver === receiver && l.handler === h) {
                delete ls[i];
                ls.push(l);
                return;
            }
        }
        sender.listeners.push({ receiver: receiver, handler: h });
        let idx = this.m_senders.indexOf(sender);
        if (idx < 0)
            this.m_senders.push(sender);
    }
    static send(sender, message, ...args) {
        let ls = this.validSender(sender);
        if (!ls)
            return;
        sender.sending++;
        for (let i = 0; i < ls.length;) {
            let l = ls[i];
            if (!l)
                sender.sending > 1 ? ++i : ls.splice(i, 1);
            else {
                l.handler.call(l.receiver, message, sender, ...args);
                ++i;
            }
        }
        sender.sending--;
    }
    static remove(receiver) {
        for (const sender of this.m_senders) {
            let ls = this.validSender(sender);
            if (!ls)
                continue;
            for (let i = 0; i < ls.length; ++i) {
                let l = ls[i];
                if (l && l.receiver === receiver)
                    delete ls[i];
            }
        }
    }
}
CCMessageCenter.m_senders = [];
//window.CCMessageCenter = CCMessageCenter;
