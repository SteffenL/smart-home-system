const crypto = require("crypto");
const readline = require("readline");

const MIN_SALT_LENGTH = 16;
const DEFAULT_SALT_LENGTH = 32;
const MIN_HASH_ITERATIONS = 200000;
const DEFAULT_HASH_ITERATIONS = 1000000;
const MIN_DERIVED_KEY_LENGTH = 32;
const DEFAULT_DERIVED_KEY_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 16;
const MIN_PEPPER_LENGTH = 32;
const DIGEST_ALGORITHM = "sha512";

function promiseQuestion(message) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(message, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function promptNumber(prompt, defaultValue, minLength, prompter) {
    prompter = prompter || promiseQuestion;
    while (true) {
        const input = await prompter(`${prompt} (default: ${defaultValue}): `);
        if (input.length > 0) {
            const value = parseInt(input);
            if (value === NaN || value < minLength) {
                console.log(`Minimum value for "${prompt}" is ${minLength}.`);
                continue;
            }
            return value;
        }
        return defaultValue;
    }
}

async function promptString(prompt, minLength, prompter) {
    prompter = prompter || promiseQuestion;
    while (true) {
        const input = await prompter(`${prompt}: `);
        if (!input || input.length < minLength) {
            console.log(`Minimum length for "${prompt}" is ${minLength} characters.`);
            continue;
        }
        return input;
    }
}

async function promptStringSecretly(prompt, placeholder) {
    return new Promise((resolve, reject) => {
        placeholder = placeholder === undefined ? "(hidden)" : placeholder;

        // https://nodejs.org/api/stream.html#api-for-stream-consumers
        process.stdout.write(prompt + placeholder);

        const wasRaw = process.stdin.isRaw;
        if (!wasRaw) {
            // https://nodejs.org/api/tty.html#readstreamsetrawmodemode
            process.stdin.setRawMode(true);
            process.stdin.resume();
        }

        const previousEncoding = process.stdin.readableEncoding;
        process.stdin.setEncoding("utf8");

        let input = [];

        const cancel = () => {
            process.stdin.setRawMode(wasRaw);
            process.stdin.setEncoding(previousEncoding);
            process.stdin.off("data", onData);
            reject(new Error("Canceled"));
        };

        const backspace = () => {
            input.pop();
        };

        const enter = () => {
            process.stdin.setRawMode(wasRaw);
            process.stdin.setEncoding(previousEncoding);
            process.stdin.off("data", onData);
            if (!wasRaw) {
                process.stdin.pause();
            }
            process.stdout.write("\n");
            resolve(Buffer.from(input).toString("utf8"));
        };

        const append = c => {
            input.push(c);
        };

        const onData = chunk => {
            top:
            for (const character of chunk) {
                const c = character.charCodeAt(0);
                switch (c) {
                    case 0x03: // ^C  end of text
                    case 0x04: // ^D  end of transmission
                    case 0x18: // ^X  cancel
                        cancel();
                        break;
                    case 0x08: // ^H  backspace
                    case 0x7f: // DEL delete
                        backspace();
                        break;
                    // TODO: Safe to assume that LF and CR do not arrive together?
                    case 0x0a: // ^J  line feed
                    case 0x0d: // ^M  carriage return
                        enter();
                        break;
                    case 0x1b: // ^[  escape
                        // Skip escape sequences
                        break top;
                    default:
                        if (c < 0x20) { // control character range
                            //process.stdout.write("\u0007"); // bell
                            continue;
                        }
                        append(c);
                        break;
                }
            }
        };

        process.stdin.on("data", onData);
    });
}

async function promptSaltLength() {
    return await promptNumber("Salt length", DEFAULT_SALT_LENGTH, MIN_SALT_LENGTH);
}

async function promptHashIterations() {
    return await promptNumber("Hash iterations", DEFAULT_HASH_ITERATIONS, MIN_HASH_ITERATIONS);
}

async function promptDerivedKeyLength() {
    return await promptNumber("Derived key length", DEFAULT_DERIVED_KEY_LENGTH, MIN_DERIVED_KEY_LENGTH);
}

async function promptPassword() {
    return await promptString("Password", MIN_PASSWORD_LENGTH, promptStringSecretly);
}

async function promptPepper() {
    return await promptString("Pepper", MIN_PEPPER_LENGTH, promptStringSecretly);
}

(async () => {
    const hashIterations = await promptHashIterations();
    const saltLength = await promptSaltLength();
    const keyLength = await promptDerivedKeyLength();
    const password = await promptPassword();
    const pepper = await promptPepper();

    const hmac = crypto.createHmac(DIGEST_ALGORITHM, pepper);
    hmac.update(password);
    const hmacDigest = hmac.digest();

    const salt = crypto.randomBytes(saltLength);
    const key = crypto.pbkdf2Sync(hmacDigest, salt, hashIterations, keyLength, DIGEST_ALGORITHM);

    const digest = `${hashIterations}:${DIGEST_ALGORITHM}:${salt.toString("base64")}:${key.toString("base64")}`;
    console.log(`Put this in your configuration file:\n${digest}`);
})();
