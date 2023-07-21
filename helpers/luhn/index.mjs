const luhn = (str) => {
    const ord = 48;
    const textEncoder = new TextEncoder();
    const bytes = textEncoder.encode(String(str));
    let ptr = bytes.length - 1;
    let sum = 0;
    let mul = 2;
    while (ptr >= 0) {
        let val = bytes[ptr--] - ord;
        val *= mul;
        sum += ((val % 10) + val / 10) | 0;
        mul = 1 + (mul % 2);
    }
    return (10 - (sum % 10)) % 10;
};

export { luhn };
