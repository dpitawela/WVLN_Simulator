export interface StoreModel {
    url: string,
    actions?: ActionModel[]
}

export interface ActionModel {
    type: string,

    x?: number,
    y?: number,
    width?: number,
    height?: number,

    href?: string,
    outer_html?: string

    x_offset?: number
    y_offset?: number
}