export const conditions = [
 { id: 'stroke', number: '01', title: 'Stroke rehabilitation', description: 'Support for movement, walking and everyday function after a stroke.', icon: 'activity', guide: 'walking-after-stroke-recovery-timeline' },
 { id: 'brain-injury', number: '02', title: 'Brain injury rehabilitation', description: 'A considered approach to mobility, daily tasks and life after brain injury.', icon: 'brain', guide: 'balance-problems-after-tbi-walking-aids' },
 { id: 'spinal-cord-injury', number: '03', title: 'Spinal cord injury rehabilitation', description: 'Discuss mobility, positioning, transfers and your individual support needs.', icon: 'accessibility', guide: 'first-neuro-physiotherapy-assessment' },
 { id: 'parkinsons', number: '04', title: "Parkinson's physiotherapy", description: 'Help with movement, balance and staying active in everyday life.', icon: 'heart', guide: 'aquatic-physiotherapy-parkinsons' },
] as const;
export const serviceCategories = [
 { href: '/services', title: 'Premium Home Neurorehabilitation - India', detail: 'Individualised rehabilitation delivered at home by trained professionals, with structured goals, clinical reviews and caregiver education.', icon: 'home' },
 { href: '/services#technology', title: 'Advanced Rehabilitation Technology', detail: 'Robotic-assisted rehabilitation, electrical stimulation, EMG biofeedback and other evidence-informed technologies, selected according to clinical needs and availability.', icon: 'activity' },
 { href: '/services#multidisciplinary', title: 'Multidisciplinary Neurorehabilitation', detail: 'Coordinated physiotherapy, occupational therapy, speech and swallowing rehabilitation, cognitive support and caregiver training, subject to specialist availability.', icon: 'users' },
 { href: '/international', title: 'International Rehabilitation Programmes', detail: 'Specialist-led rehabilitation planning, remote reviews and selected in-person programmes for international families, subject to local requirements and deployment feasibility.', icon: 'globe' },
 { href: '/nri', title: 'Rehabilitation for Families Living Abroad', detail: 'Help for overseas families arranging rehabilitation for a loved one in India, including care planning, therapist coordination and scheduled family updates.', icon: 'heart' },
 { href: '/equipment', title: 'Rehabilitation Equipment Solutions', detail: 'Clinical guidance on selecting and sourcing suitable rehabilitation devices, mobility aids and home therapy equipment, including international procurement where feasible.', icon: 'accessibility' },
] as const;
export const internationalOptions = [
 { href: '/international', title: 'International In-Person Rehabilitation', detail: 'Therapist deployment and coordinated rehabilitation programmes in selected countries.', icon: 'globe' },
 { href: '/remote', title: 'International Virtual Rehabilitation', detail: 'Online assessments, clinical reviews and caregiver guidance where clinically and legally appropriate.', icon: 'monitor' },
 { href: '/second-opinion', title: 'International Second Opinions', detail: 'Rehabilitation-focused consultations and specialist coordination, clearly distinguished from medical diagnostic opinions.', icon: 'clipboard' },
 { href: '/equipment', title: 'International Equipment Solutions', detail: 'Assistance with selecting and sourcing rehabilitation technologies.', icon: 'accessibility' },
] as const;
export const careOptions = [...serviceCategories, internationalOptions[1], internationalOptions[2],
 { href: '/community', title: 'Caregiver support', detail: 'Guidance for the people beside you', icon: 'users' },
] as const;
export const homeAreas = ['Nallagandla', 'Tellapur', 'Gachibowli', 'Kondapur', 'Nanakramguda', 'Manikonda', 'Miyapur', 'Kukatpally', 'Madhapur', 'Jubilee Hills', 'Banjara Hills'];
export const internationalCountries = ['Tanzania', 'Kenya', 'United Arab Emirates', 'Oman', 'Maldives', 'Qatar', 'Nepal', 'Sri Lanka', 'New Zealand', 'Kazakhstan', 'Uzbekistan', 'Bangladesh', 'Cambodia', 'Fiji', 'Trinidad and Tobago', 'Mongolia', 'Bhutan', 'Laos'] as const;
