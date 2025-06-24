export interface Department {
  id: string;
  name: string;
  description?: string;
}

export const DEPARTMENTS: Department[] = [
  { id: '1', name: 'Java' },
  { id: '2', name: 'Apex' },
  { id: '3', name: 'Be Informed' },
  { id: '4', name: 'Business Intelligence' },
  { id: '5', name: 'Office Management' },
  { id: '6', name: 'Delivery Management' },
  { id: '7', name: 'People and Culture' },
  { id: '8', name: 'DBA' }
];