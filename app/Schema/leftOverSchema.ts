export interface LeftoverItem {
    inventory_id: string;
    item_id: string;
    quantity: number;
    reason: string;
}

export interface Leftover {
    _id: string;
    order_id: string;
    items: LeftoverItem[];
}
