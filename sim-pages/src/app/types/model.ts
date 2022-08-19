export interface StoreModel {
    url: string,
    actions?: ActionModel[]
}

export interface ActionModel {
    type: string,
    x_pos?: number,
    y_pos?: number,
    href?: string,
    outer_html?: string
}