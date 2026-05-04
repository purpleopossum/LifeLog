export interface Checkin {
  habit: {
    title: string;
  };
  status: string;
  note?: string;
}

export interface Entry {
  id: string;
  title: string;
  content: string;
  entryDate: string;
  linkedCheckins: Checkin[];
}
