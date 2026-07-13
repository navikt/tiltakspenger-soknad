import pino, { LoggerOptions } from 'pino';
import redactPaths from './redactPaths';

const loggerOptions: LoggerOptions = {
    redact: {
        paths: redactPaths,
        remove: true,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => {
            return { level: label };
        },
        log: (object: any) => {
            if (object.err) {
                const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
                object.stack_trace = err.stack;
                object.type = err.type;
                // NB: ikke sett object.message her — msg mappes til message-feltet i Elastic,
                // og en overskriving med err.message gjør alle feillinjer identiske i Kibana.
                delete object.err;
            }

            return object;
        },
    },
};

const serverLogger = pino(loggerOptions);

export default serverLogger;
