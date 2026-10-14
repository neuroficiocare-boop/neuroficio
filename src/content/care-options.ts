export const conditions = [
 { id: 'stroke', number: '01', title: 'Stroke rehabilitation', description: 'Support for movement, walking and everyday function after a stroke.', icon: 'activity', guide: 'walking-after-stroke-recovery-timeline' },
 { id: 'brain-injury', number: '02', title: 'Brain injury rehabilitation', description: 'A considered approach to mobility, daily tasks and life after brain injury.', icon: 'brain', guide: 'balance-problems-after-tbi-walking-aids' },
 { id: 'spinal-cord-injury', number: '03', title: 'Spinal cord injury rehabilitation', description: 'Discuss mobility, positioning, transfers and your individual support needs.', icon: 'accessibility', guide: 'first-neuro-physiotherapy-assessment' },
 { id: 'parkinsons', number: '04', title: "Parkinson's physiotherapy", description: 'Help with movement, balance and staying active in everyday life.', icon: 'heart', guide: 'aquatic-physiotherapy-parkinsons' },
] as const;
export const careOptions = [
 { href: '/services', title: 'Home rehabilitation', detail: 'In-person care in Hyderabad', icon: 'home' },
 { href: '/international', title: 'Online rehabilitation', detail: 'Enquire from your country', icon: 'globe' },
 { href: '/equipment', title: 'Equipment guidance', detail: 'Support that fits your needs', icon: 'accessibility' },
 { href: '/second-opinion', title: 'Second opinions', detail: 'Clarity before a care decision', icon: 'clipboard' },
 { href: '/community', title: 'Caregiver support', detail: 'Guidance for the people beside you', icon: 'users' },
] as const;
export const homeAreas = ['Nallagandla', 'Tellapur', 'Gachibowli', 'Kondapur', 'Nanakramguda', 'Manikonda', 'Miyapur', 'Kukatpally', 'Madhapur', 'Jubilee Hills', 'Banjara Hills'];
