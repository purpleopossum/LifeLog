export interface Milestone {
    id: number;
    description: string;
    sequenceOrder: number;
    isCompleted: boolean;
}

export interface Challenge {
    id: number;
    title: string;
    description: string;
    milestones: Milestone[];
}
