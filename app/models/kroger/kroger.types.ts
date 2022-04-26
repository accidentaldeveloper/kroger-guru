export interface ProductsResponse {
    data: Product[];
    meta: Meta;
}

export interface Product {
    productId:       string;
    upc:             string;
    aisleLocations:  any[];
    brand:           string;
    categories:      string[];
    countryOrigin:   CountryOrigin;
    description:     string;
    images:          Image[];
    items:           Item[];
    itemInformation: ItemInformation;
    temperature:     Temperature;
}

export enum CountryOrigin {
    Mexico = "MEXICO",
    UnitedStates = "UNITED STATES",
}

export interface Image {
    perspective: Perspective;
    featured?:   boolean;
    sizes:       SizeElement[];
}

export enum Perspective {
    Back = "back",
    Front = "front",
    Left = "left",
    Right = "right",
    Top = "top",
}

export interface SizeElement {
    size: SizeEnum;
    url:  string;
}

export enum SizeEnum {
    Large = "large",
    Medium = "medium",
    Small = "small",
    Thumbnail = "thumbnail",
    Xlarge = "xlarge",
}

export interface ItemInformation {
}

export interface Item {
    itemId:      string;
    favorite:    boolean;
    fulfillment: Fulfillment;
    size:        string;
}

export interface Fulfillment {
    curbside:   boolean;
    delivery:   boolean;
    inStore:    boolean;
    shipToHome: boolean;
}

export interface Temperature {
    indicator:     Indicator;
    heatSensitive: boolean;
}

export enum Indicator {
    Ambient = "Ambient",
    Frozen = "Frozen",
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    start: number;
    limit: number;
    total: number;
}
