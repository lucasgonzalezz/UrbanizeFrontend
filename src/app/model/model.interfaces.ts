import { HttpErrorResponse } from '@angular/common/http';

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;

    strSortField: string;
    strSortDirection: string;
    strFilter: string;
    strFilteredTitle: string;
    strFilteredMessage: string;
    nRecords: number;
}

export interface IEntity {
    id: number;
}

export interface IUser extends IEntity {
    name: string,
    last_name1: string,
    last_name2: string,
    birth_date: Date,
    phone_number: number,
    dni: string,
    city: string,
    postal_code: number,
    address: string,
    email: string,
    username: string,
    role: boolean,
    carrts: number,
    rating: number,
    purchases: number
}

export interface IUserPage extends IPage<IUser> {

}

export interface IProduct extends IEntity {
    name: string,
    stock: number,
    size: string,
    price: number,
    image?: string,
    category: ICategory,
    ratings: number,
    carts: number,
    purchaseDetails: number
}

export interface IProductPage extends IPage<IProduct> {

}

export interface ICart extends IEntity {
    user: IUser,
    product: IProduct,
    quantity: number,
}

export interface ICartPage extends IPage<ICart> {

}

export interface ICategory extends IEntity {
    name: string,
    products: number
}

export interface ICategoryPage extends IPage<ICategory> {

}

export interface IRating extends IEntity {
    title: string,
    description: string,
    image?: string,
    punctuation: number,
    date: Date,
    user: IUser,
    product: IProduct,
}

export interface IRatingPage extends IPage<IRating> {

}

export interface IPurchase extends IEntity {
    purchase_date: Date,
    delivery_date: Date,
    status: string,
    prchase_code: number,
    user: IUser,
    num_bill: number,
    date_bill: Date,
    purchaseDetails: number
}

export interface IPurchasePage extends IPage<IPurchase> {

}

export interface IPurchaseDetail extends IEntity {
    amount: number,
    price: number,
    purchase: IPurchase,
    product: IProduct,
}

export interface IPurchaseDetailPage extends IPage<IPurchaseDetail> {

}