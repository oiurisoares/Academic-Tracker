import { CollegeType } from '@prisma/client';

export interface College {
    accreditation: string;
    address: string;
    cnpj: string;
    createdAt?: Date | null;
    establishedAt?: Date | null;
    id: string;
    isActive?: boolean | null;
    name: string;
    phone?: string | null;
    photo?: string | null;
    token?: string | null;
    type?: CollegeType | null;
    updatedAt?: Date | null;
    website?: string | null;
}

export type CollegeIdentifier = Pick<College,
    'accreditation' |
    'cnpj' |
    'id' |
    'isActive' |
    'name' |
    'type' |
    'website'>
