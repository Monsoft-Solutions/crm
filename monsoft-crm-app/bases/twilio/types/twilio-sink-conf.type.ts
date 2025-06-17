export type TwilioSinkConf = {
    batch_events: boolean;
    destination: string;
    method: 'post' | 'get';
};
