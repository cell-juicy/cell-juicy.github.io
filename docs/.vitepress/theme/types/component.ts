export type ComponentFallbackConfig = {
    tag?: {
    
        onClick?: (tag: string) => void;
        
        format?: (tag: string) => string;
    };

    aside?: {
        noTab?: string;

        unknownTab?: string;
    };

    asideTabTags?: {
        empty?: string;
    };

    asideTabSeries?: {
        empty?: string;

        noSeries?: string;
    };

    asideTabTree?: {
        empty?: string;

        noSpace?: string;
    };

    asideTabResources?: {
        empty?: string;
    };
};