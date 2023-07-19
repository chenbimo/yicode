import { randomBytes } from 'crypto';

let IDX = 256,
    HEX = [],
    SIZE = 256 * 16,
    BUFFER;
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

const uid = (len) => {
    let str = '',
        tmp = len || 11,
        num = ((1 + tmp) / 2) | 0;
    if (!BUFFER || IDX + num > SIZE) {
        BUFFER = randomBytes(SIZE);
        IDX = 0;
    }

    while (num--) {
        str += HEX[BUFFER[IDX++]];
    }

    return str.substring(0, tmp);
};

export { uid };
