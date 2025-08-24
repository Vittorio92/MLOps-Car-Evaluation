export type BuyingPrice = 'vhigh' | 'high' | 'med' | 'low';
export type Maintenance = 'vhigh' | 'high' | 'med' | 'low';
export type Doors = '2' | '3' | '4' | '5more';
export type Persons = '2' | '4' | 'more';
export type LugBoot = 'small' | 'med' | 'big';
export type Safety = 'low' | 'med' | 'high';
export type Classe = 'unacc' | 'acc' | 'good' | 'vgood';

export interface CarFormValue {
    buying: BuyingPrice | '';
    maint: Maintenance | '';
    doors: Doors | '';
    persons: Persons | '';
    lug_boot: LugBoot | '';
    safety: Safety | '';
}

export interface PredictionResult {
    prediction: 'unacc' | 'acc' | 'good' | 'vgood';
}


export interface Prediction {
    user_email: string | null,
    buying: BuyingPrice | '';
    maint: Maintenance | '';
    doors: Doors | '';
    persons: Persons | '';
    lug_boot: LugBoot | '';
    safety: Safety | '';
    class: Classe | '';
}

export interface sPrediction {
    id: number | null,
    buying: BuyingPrice | '';
    maint: Maintenance | '';
    doors: Doors | '';
    persons: Persons | '';
    lug_boot: LugBoot | '';
    safety: Safety | '';
    class: Classe | '';
}

export interface ListPredictionResponse {
    page: number;
    total_pages: number;
    predictions: sPrediction[];
}

export interface User {
    email: string;
    name: string;
}