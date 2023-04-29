let TOKEN_TRUE = -1;
let TOKEN_FALSE = -2;
let TOKEN_NULL = -3;
let TOKEN_EMPTY_STRING = -4;
let TOKEN_UNDEFINED = -5;

// json粉碎
function jsonCrush(data, maxSubstringLength = 50) {
    let string = JSON.stringify(data);
    const delimiter = '\u0001'; // used to split parts of crushed string
    const JSCrush = (string, replaceCharacters) => {
        // JSCrush Algorithm (repleace repeated substrings with single characters)
        let replaceCharacterPos = replaceCharacters.length;
        let splitString = '';

        const ByteLength = (string) => encodeURI(encodeURIComponent(string)).replace(/%../g, 'i').length;
        const HasUnmatchedSurrogate = (string) => {
            // check ends of string for unmatched surrogate pairs
            let c1 = string.charCodeAt(0);
            let c2 = string.charCodeAt(string.length - 1);
            return (c1 >= 0xdc00 && c1 <= 0xdfff) || (c2 >= 0xd800 && c2 <= 0xdbff);
        };

        // count instances of substrings
        let substringCount = {};
        for (let substringLength = 2; substringLength < maxSubstringLength; substringLength++)
            for (let i = 0; i < string.length - substringLength; ++i) {
                let substring = string.substr(i, substringLength);

                // don't recount if already in list
                if (substringCount[substring]) continue;

                // prevent breaking up unmatched surrogates
                if (HasUnmatchedSurrogate(substring)) continue;

                // count how many times the substring appears
                let count = 1;
                for (let substringPos = string.indexOf(substring, i + substringLength); substringPos >= 0; ++count) substringPos = string.indexOf(substring, substringPos + substringLength);

                // add to list if it appears multiple times
                if (count > 1) substringCount[substring] = count;
            }

        while (true) {
            // loop while string can be crushed more
            // get the next character that is not in the string
            for (; replaceCharacterPos-- && string.includes(replaceCharacters[replaceCharacterPos]); ) {}
            if (replaceCharacterPos < 0) break; // ran out of replacement characters
            let replaceCharacter = replaceCharacters[replaceCharacterPos];

            // find the longest substring to replace
            let bestSubstring;
            let bestLengthDelta = 0;
            let replaceByteLength = ByteLength(replaceCharacter);
            for (let substring in substringCount) {
                // calculate change in length of string if it substring was replaced
                let count = substringCount[substring];
                let lengthDelta = (count - 1) * ByteLength(substring) - (count + 1) * replaceByteLength;
                if (!splitString.length) lengthDelta -= ByteLength(delimiter); // include the delimiter length
                if (lengthDelta <= 0) delete substringCount[substring];
                else if (lengthDelta > bestLengthDelta) {
                    bestSubstring = substring;
                    bestLengthDelta = lengthDelta;
                }
            }
            if (!bestSubstring) break; // string can't be compressed further

            // create new string with the split character
            string = string.split(bestSubstring).join(replaceCharacter) + replaceCharacter + bestSubstring;
            splitString = replaceCharacter + splitString;

            // update substring count list after the replacement
            let newSubstringCount = {};
            for (let substring in substringCount) {
                // make a new substring with the replacement
                let newSubstring = substring.split(bestSubstring).join(replaceCharacter);

                // count how many times the new substring appears
                let count = 0;
                for (let i = string.indexOf(newSubstring); i >= 0; ++count) i = string.indexOf(newSubstring, i + newSubstring.length);

                // add to list if it appears multiple times
                if (count > 1) newSubstringCount[newSubstring] = count;
            }
            substringCount = newSubstringCount;
        }

        return { a: string, b: splitString };
    };

    // create a string of replacement characters
    let characters = [];

    // prefer replacing with characters that will not be escaped by encodeURIComponent
    const unescapedCharacters = `-_.!~*'()`;
    for (let i = 127; --i; ) {
        if (
            (i >= 48 && i <= 57) || // 0-9
            (i >= 65 && i <= 90) || // A-Z
            (i >= 97 && i <= 122) || // a-z
            unescapedCharacters.includes(String.fromCharCode(i))
        )
            characters.push(String.fromCharCode(i));
    }

    // pick from extended set last
    for (let i = 32; i < 255; ++i) {
        let c = String.fromCharCode(i);
        if (c != '\\' && !characters.includes(c)) characters.unshift(c);
    }

    // remove delimiter if it is found in the string
    string = string.replace(new RegExp(delimiter, 'g'), '');

    // swap out common json characters
    string = JSONCrushSwap(string);

    // crush with JS crush
    const crushed = JSCrush(string, characters);

    // insert delimiter between JSCrush parts
    let crushedString = crushed.a;
    if (crushed.b.length) crushedString += delimiter + crushed.b;

    // fix issues with some links not being recognized properly
    crushedString += '_';

    // return crushed string
    return crushedString;
}

// json不粉碎
function jsonUncrush(string) {
    // remove last character
    string = string.substring(0, string.length - 1);

    // unsplit the string using the delimiter
    const stringParts = string.split('\u0001');

    // JSUncrush algorithm
    let uncrushedString = stringParts[0];
    if (stringParts.length > 1) {
        let splitString = stringParts[1];
        for (let character of splitString) {
            // split the string using the current splitCharacter
            let splitArray = uncrushedString.split(character);

            // rejoin the string with the last element from the split
            uncrushedString = splitArray.join(splitArray.pop());
        }
    }

    // unswap the json characters in reverse direction
    return JSON.parse(JSONCrushSwap(uncrushedString, 0));
}

function JSONCrushSwap(string, forward = 1) {
    // swap out characters for lesser used ones that wont get escaped
    const swapGroups = [
        ['"', "'"],
        ["':", '!'],
        [",'", '~'],
        ['}', ')', '\\', '\\'],
        ['{', '(', '\\', '\\']
    ];

    const swapInternal = (string, g) => {
        let regex = new RegExp(`${(g[2] ? g[2] : '') + g[0]}|${(g[3] ? g[3] : '') + g[1]}`, 'g');
        return string.replace(regex, ($1) => ($1 === g[0] ? g[1] : g[0]));
    };

    // need to be able to swap characters in reverse direction for uncrush
    if (forward) for (let i = 0; i < swapGroups.length; ++i) string = swapInternal(string, swapGroups[i]);
    else for (let i = swapGroups.length; i--; ) string = swapInternal(string, swapGroups[i]);

    return string;
}

function jsonPack(json, options) {
    // Canonizes the options
    options = options || {};

    // A shorthand for debugging
    let verbose = options.verbose || false;

    verbose && console.log('Normalize the JSON Object');

    // JSON as Javascript Object (Not string representation)
    json = typeof json === 'string' ? this.JSON.parse(json) : json;

    verbose && console.log('Creating a empty dictionary');

    // The dictionary
    let dictionary = {
        strings: [],
        integers: [],
        floats: []
    };

    verbose && console.log('Creating the AST');

    // The AST
    let ast = (function recursiveAstBuilder(item) {
        verbose && console.log('Calling recursiveAstBuilder with ' + this.JSON.stringify(item));

        // The type of the item
        let type = typeof item;

        // Case 7: The item is null
        if (item === null) {
            return {
                type: 'null',
                index: TOKEN_NULL
            };
        }

        //add undefined
        if (typeof item === 'undefined') {
            return {
                type: 'undefined',
                index: TOKEN_UNDEFINED
            };
        }

        // Case 1: The item is Array Object
        if (item instanceof Array) {
            // Create a new sub-AST of type Array (@)
            let ast = ['@'];

            // Add each items
            for (let i in item) {
                if (!item.hasOwnProperty(i)) continue;

                ast.push(recursiveAstBuilder(item[i]));
            }

            // And return
            return ast;
        }

        // Case 2: The item is Object
        if (type === 'object') {
            // Create a new sub-AST of type Object ($)
            let ast = ['$'];

            // Add each items
            for (let key in item) {
                if (!item.hasOwnProperty(key)) continue;

                ast.push(recursiveAstBuilder(key));
                ast.push(recursiveAstBuilder(item[key]));
            }

            // And return
            return ast;
        }

        // Case 3: The item empty string
        if (item === '') {
            return {
                type: 'empty',
                index: TOKEN_EMPTY_STRING
            };
        }

        // Case 4: The item is String
        if (type === 'string') {
            // The index of that word in the dictionary
            let index = _indexOf.call(dictionary.strings, item);

            // If not, add to the dictionary and actualize the index
            if (index == -1) {
                dictionary.strings.push(_encode(item));
                index = dictionary.strings.length - 1;
            }

            // Return the token
            return {
                type: 'strings',
                index: index
            };
        }

        // Case 5: The item is integer
        if (type === 'number' && item % 1 === 0) {
            // The index of that number in the dictionary
            let index = _indexOf.call(dictionary.integers, item);

            // If not, add to the dictionary and actualize the index
            if (index == -1) {
                dictionary.integers.push(_base10To36(item));
                index = dictionary.integers.length - 1;
            }

            // Return the token
            return {
                type: 'integers',
                index: index
            };
        }

        // Case 6: The item is float
        if (type === 'number') {
            // The index of that number in the dictionary
            let index = _indexOf.call(dictionary.floats, item);

            // If not, add to the dictionary and actualize the index
            if (index == -1) {
                // Float not use base 36
                dictionary.floats.push(item);
                index = dictionary.floats.length - 1;
            }

            // Return the token
            return {
                type: 'floats',
                index: index
            };
        }

        // Case 7: The item is boolean
        if (type === 'boolean') {
            return {
                type: 'boolean',
                index: item ? TOKEN_TRUE : TOKEN_FALSE
            };
        }

        // Default
        throw new Error('Unexpected argument of type ' + typeof item);
    })(json);

    // A set of shorthands proxies for the length of the dictionaries
    let stringLength = dictionary.strings.length;
    let integerLength = dictionary.integers.length;
    let floatLength = dictionary.floats.length;

    verbose && console.log('Parsing the dictionary');

    // Create a raw dictionary
    let packed = dictionary.strings.join('|');
    packed += '^' + dictionary.integers.join('|');
    packed += '^' + dictionary.floats.join('|');

    verbose && console.log('Parsing the structure');

    // And add the structure
    packed +=
        '^' +
        (function recursiveParser(item) {
            verbose && console.log('Calling a recursiveParser with ' + this.JSON.stringify(item));

            // If the item is Array, then is a object of
            // type [object Object] or [object Array]
            if (item instanceof Array) {
                // The packed resulting
                let packed = item.shift();

                for (let i in item) {
                    if (!item.hasOwnProperty(i)) continue;

                    packed += recursiveParser(item[i]) + '|';
                }

                return (packed[packed.length - 1] === '|' ? packed.slice(0, -1) : packed) + ']';
            }

            // A shorthand proxies
            let type = item.type,
                index = item.index;

            if (type === 'strings') {
                // Just return the base 36 of index
                return _base10To36(index);
            }

            if (type === 'integers') {
                // Return a base 36 of index plus stringLength offset
                return _base10To36(stringLength + index);
            }

            if (type === 'floats') {
                // Return a base 36 of index plus stringLength and integerLength offset
                return _base10To36(stringLength + integerLength + index);
            }

            if (type === 'boolean') {
                return item.index;
            }

            if (type === 'null') {
                return TOKEN_NULL;
            }

            if (type === 'undefined') {
                return TOKEN_UNDEFINED;
            }

            if (type === 'empty') {
                return TOKEN_EMPTY_STRING;
            }

            throw new TypeError('The item is alien!');
        })(ast);

    verbose && console.log('Ending parser');

    // If debug, return a internal representation of dictionary and stuff
    if (options.debug)
        return {
            dictionary: dictionary,
            ast: ast,
            packed: packed
        };

    return packed;
}

function jsonUnpack(packed, options) {
    // Canonizes the options
    options = options || {};

    // A raw buffer
    let rawBuffers = packed.split('^');

    // Create a dictionary
    options.verbose && console.log('Building dictionary');
    let dictionary = [];

    // Add the strings values
    let buffer = rawBuffers[0];
    if (buffer !== '') {
        buffer = buffer.split('|');
        options.verbose && console.log('Parse the strings dictionary');
        for (let i = 0, n = buffer.length; i < n; i++) {
            dictionary.push(_decode(buffer[i]));
        }
    }

    // Add the integers values
    buffer = rawBuffers[1];
    if (buffer !== '') {
        buffer = buffer.split('|');
        options.verbose && console.log('Parse the integers dictionary');
        for (let i = 0, n = buffer.length; i < n; i++) {
            dictionary.push(_base36To10(buffer[i]));
        }
    }

    // Add the floats values
    buffer = rawBuffers[2];
    if (buffer !== '') {
        buffer = buffer.split('|');
        options.verbose && console.log('Parse the floats dictionary');
        for (let i = 0, n = buffer.length; i < n; i++) {
            dictionary.push(parseFloat(buffer[i]));
        }
    }
    // Free memory
    buffer = null;

    options.verbose && console.log('Tokenizing the structure');

    // Tokenizer the structure
    let number36 = '';
    let tokens = [];
    let len = rawBuffers[3].length;
    for (let i = 0; i < len; i++) {
        let symbol = rawBuffers[3].charAt(i);
        if (symbol === '|' || symbol === '$' || symbol === '@' || symbol === ']') {
            if (number36) {
                tokens.push(_base36To10(number36));
                number36 = '';
            }
            symbol !== '|' && tokens.push(symbol);
        } else {
            number36 += symbol;
        }
    }

    // A shorthand proxy for tokens.length
    let tokensLength = tokens.length;

    // The index of the next token to read
    let tokensIndex = 0;

    options.verbose && console.log('Starting recursive parser');

    return (function recursiveUnpackerParser() {
        // Maybe '$' (object) or '@' (array)
        let type = tokens[tokensIndex++];

        options.verbose && console.log('Reading collection type ' + (type === '$' ? 'object' : 'Array'));

        // Parse an array
        if (type === '@') {
            let node = [];

            for (; tokensIndex < tokensLength; tokensIndex++) {
                let value = tokens[tokensIndex];
                options.verbose && console.log('Read ' + value + ' symbol');
                if (value === ']') return node;
                if (value === '@' || value === '$') {
                    node.push(recursiveUnpackerParser());
                } else {
                    switch (value) {
                        case TOKEN_TRUE:
                            node.push(true);
                            break;
                        case TOKEN_FALSE:
                            node.push(false);
                            break;
                        case TOKEN_NULL:
                            node.push(null);
                            break;
                        case TOKEN_UNDEFINED:
                            node.push(undefined);
                            break;
                        case TOKEN_EMPTY_STRING:
                            node.push('');
                            break;
                        default:
                            node.push(dictionary[value]);
                    }
                }
            }

            options.verbose && console.log('Parsed ' + this.JSON.stringify(node));

            return node;
        }

        // Parse a object
        if (type === '$') {
            let node = {};

            for (; tokensIndex < tokensLength; tokensIndex++) {
                let key = tokens[tokensIndex];

                if (key === ']') return node;

                if (key === TOKEN_EMPTY_STRING) key = '';
                else key = dictionary[key];

                let value = tokens[++tokensIndex];

                if (value === '@' || value === '$') {
                    node[key] = recursiveUnpackerParser();
                } else {
                    switch (value) {
                        case TOKEN_TRUE:
                            node[key] = true;
                            break;
                        case TOKEN_FALSE:
                            node[key] = false;
                            break;
                        case TOKEN_NULL:
                            node[key] = null;
                            break;
                        case TOKEN_UNDEFINED:
                            node[key] = undefined;
                            break;
                        case TOKEN_EMPTY_STRING:
                            node[key] = '';
                            break;
                        default:
                            node[key] = dictionary[value];
                    }
                }
            }

            options.verbose && console.log('Parsed ' + this.JSON.stringify(node));

            return node;
        }

        throw new TypeError('Bad token ' + type + " isn't a type");
    })();
}
/**
 * Get the index value of the dictionary
 * @param {Object} dictionary a object that have two array attributes: 'string' and 'number'
 * @param {Object} data
 */
let _indexOfDictionary = function (dictionary, value) {
    // The type of the value
    let type = typeof value;

    // If is boolean, return a boolean token
    if (type === 'boolean') return value ? TOKEN_TRUE : TOKEN_FALSE;

    // If is null, return a... yes! the null token
    if (value === null) return TOKEN_NULL;

    //add undefined
    if (typeof value === 'undefined') return TOKEN_UNDEFINED;

    if (value === '') {
        return TOKEN_EMPTY_STRING;
    }

    if (type === 'string') {
        value = _encode(value);
        let index = _indexOf.call(dictionary.strings, value);
        if (index === -1) {
            dictionary.strings.push(value);
            index = dictionary.strings.length - 1;
        }
    }

    // If has an invalid JSON type (example a function)
    if (type !== 'string' && type !== 'number') {
        throw new Error('The type is not a JSON type');
    }

    if (type === 'string') {
        // string
        value = _encode(value);
    } else if (value % 1 === 0) {
        // integer
        value = _base10To36(value);
    } else {
        // float
    }

    // If is number, "serialize" the value
    value = type === 'number' ? _base10To36(value) : _encode(value);

    // Retrieve the index of that value in the dictionary
    let index = _indexOf.call(dictionary[type], value);

    // If that value is not in the dictionary
    if (index === -1) {
        // Push the value
        dictionary[type].push(value);
        // And return their index
        index = dictionary[type].length - 1;
    }

    // If the type is a number, then add the '+'  prefix character
    // to differentiate that they is a number index. If not, then
    // just return a 36-based representation of the index
    return type === 'number' ? '+' + index : index;
};

let _encode = function (str) {
    if (typeof str !== 'string') return str;

    return str.replace(/[\+ \|\^\%]/g, function (a) {
        return {
            ' ': '+',
            '+': '%2B',
            '|': '%7C',
            '^': '%5E',
            '%': '%25'
        }[a];
    });
};

let _decode = function (str) {
    if (typeof str !== 'string') return str;

    return str.replace(/\+|%2B|%7C|%5E|%25/g, function (a) {
        return {
            '+': ' ',
            '%2B': '+',
            '%7C': '|',
            '%5E': '^',
            '%25': '%'
        }[a];
    });
};

let _base10To36 = function (number) {
    return Number.prototype.toString.call(number, 36).toUpperCase();
};

let _base36To10 = function (number) {
    return parseInt(number, 36);
};

let _indexOf =
    Array.prototype.indexOf ||
    function (obj, start) {
        for (let i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };

export { jsonPack, jsonUnpack, jsonCrush, jsonUncrush };
