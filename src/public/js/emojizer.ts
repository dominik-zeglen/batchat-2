export function emojizer(msg) {
    if(msg.type == 'text') {
        let e = {
            ':)': '😊',
            ';)': '😉',
            ':p' : '😋',
            ':P' : '😋',
            ':(': '😔',
            ';(': '😢',
            'xD': '😂',
            'XD': '😂',
            'xd': '😂'
        };

        Object.keys(e).forEach(r => {
            msg.content = msg.content.replace(r, e[r]);
        });
    }
    return msg;
}