// @flow

/**
 * A basic logger to encapsulate the console.log.
 * It log stuff only on DEBUG mode.
 */

const isLoggerEnabled: boolean = process.env.NODE_ENV !== 'production';
class Logger {
    log(...messages: Array<mixed>){
        if(isLoggerEnabled){
            console.log(...messages);
        }
    }

    error(...messages: Array<mixed>){
        if(isLoggerEnabled){
            console.error('[ERROR]', ...messages);
        }
    }
}

export default new Logger();
