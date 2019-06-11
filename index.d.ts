declare const config: config.Config;
declare namespace config {
    type Environments = Partial<Record<string, string>>;
    interface Config {
        readonly __: Utils;
        readonly [x: string]: any;
    }
    type Parser = (
        params: any,
        fn: Record<string, Parser>,
        vars?: Record<string, any>
    ) => any;
    interface Utils {
        /**
         * Deep clone an object
         *
         * @param src Clone source
         */
        clone(src: any): any;

        /**
         * Make clones of two objects then merge the second one into the first one and returns the merged object
         *
         * @param src Merge source
         * @param tar Merge target
         */
        merge(src: any, tar: any): any;

        /**
         * Read envs from file path
         *
         * @param file Env file path
         * @param inject Inject envs into NODE_ENV
         */
        env(file: string, inject?: boolean): Environments;

        /**
         * Resolve source config
         *
         * @param src Source config
         * @param envs Env vars
         */
        resolve(src: any, envs?: Environments): any;

        /**
         * Load config
         *
         * @param file Config file path
         * @param inject Env vars
         */
        load(file: string, envs?: boolean): any;

        /**
         * Clear cached config
         */
        desolve(): void;

        /**
         * Resolve source config with custom parsers
         *
         * @param fn Custom parsers
         * @param src Source config
         * @param vars vars
         */
        parse(
            fn: Record<string, Parser>,
            src: any,
            vars?: Record<string, any>
        ): any;

        /**
         * Expand variables as in shellscript
         *
         * @param src
         * @param envs
         */
        substitute(src: string, envs: Record<string, any>): string;
    }
}
export = config;
