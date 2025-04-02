import { CollegeType } from '@prisma/client';
import { Course } from './Course';

export interface College {
    accreditation: string;
    address: string;
    cnpj: string;
    course?: Course[];
    courseCount: number;
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
    'courseCount' |
    'cnpj' |
    'id' |
    'isActive' |
    'name' |
    'type' |
    'website'>
