import { College } from './College';

export interface Course {
    code: string;
    college?: College | null;
    collegeId: number;
    coordinator: string;
    createdAt?: Date | null;
    duration: number;
    id: string;
    isActive?: boolean | null;
    isConcluded?: boolean | null;
    name: string;
    updatedAt?: Date | null;
}

export type CourseIdentifier = Pick<Course,
    'code' |
    'coordinator' |
    'duration' |
    'id' |
    'isActive' |
    'isConcluded' |
    'name'>
